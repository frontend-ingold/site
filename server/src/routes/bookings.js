import express from "express";
import { pool } from "../db/pool.js";

export const bookingsRouter = express.Router();

function generateBookingReference() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function validateBooking(body) {
  const requiredFields = [
    "serviceSlug",
    "serviceName",
    "customerName",
    "phone",
    "address",
  ];

  for (const field of requiredFields) {
    if (!body[field] || !String(body[field]).trim()) {
      return `${field} is required.`;
    }
  }

  return null;
}

async function findUserIdByToken(token) {
  if (!token) {
    return null;
  }

  const result = await pool.query("SELECT user_id FROM user_sessions WHERE token = $1", [token]);
  return result.rowCount > 0 ? result.rows[0].user_id : null;
}

function extractBearerToken(request) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

bookingsRouter.get("/my", async (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  try {
    const userId = await findUserIdByToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Invalid session." });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          booking_reference,
          service_slug,
          service_name,
          customer_name,
          phone,
          address,
          preferred_date,
          issue_description,
          status,
          cancellation_reason,
          cancelled_at,
          created_at
        FROM bookings
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.json({
      bookings: result.rows.map((row) => ({
        id: row.id,
        referenceId: row.booking_reference,
        serviceSlug: row.service_slug,
        serviceName: row.service_name,
        customerName: row.customer_name,
        phone: row.phone,
        address: row.address,
        preferredDate: row.preferred_date,
        issueDescription: row.issue_description,
        status: row.status,
        cancellationReason: row.cancellation_reason,
        cancelledAt: row.cancelled_at,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error("Fetch my bookings failed.", error);
    return res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

bookingsRouter.patch("/:id/cancel", async (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  const { reason } = req.body;

  if (!reason || !String(reason).trim()) {
    return res.status(400).json({ message: "Cancellation reason is required." });
  }

  try {
    const userId = await findUserIdByToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Invalid session." });
    }

    const bookingId = Number(req.params.id);

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({ message: "Invalid booking id." });
    }

    const bookingResult = await pool.query(
      `
        SELECT id, status
        FROM bookings
        WHERE id = $1 AND user_id = $2
      `,
      [bookingId, userId]
    );

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (bookingResult.rows[0].status === "cancelled") {
      return res.status(400).json({ message: "This booking is already cancelled." });
    }

    const result = await pool.query(
      `
        UPDATE bookings
        SET
          status = 'cancelled',
          cancellation_reason = $1,
          cancelled_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING id, status, cancellation_reason, cancelled_at
      `,
      [String(reason).trim(), bookingId, userId]
    );

    return res.json({
      message: "Booking cancelled successfully.",
      booking: {
        id: result.rows[0].id,
        status: result.rows[0].status,
        cancellationReason: result.rows[0].cancellation_reason,
        cancelledAt: result.rows[0].cancelled_at,
      },
    });
  } catch (error) {
    console.error("Cancel booking failed.", error);
    return res.status(500).json({ message: "Failed to cancel booking." });
  }
});

bookingsRouter.post("/", async (req, res) => {
  const validationError = validateBooking(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const {
    serviceSlug,
    serviceName,
    customerName,
    phone,
    address,
    preferredDate,
    issueDescription,
  } = req.body;

  try {
    const token = extractBearerToken(req);
    const userId = await findUserIdByToken(token);
    let result = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const bookingReference = generateBookingReference();

      try {
        result = await pool.query(
          `
            INSERT INTO bookings (
              booking_reference,
              user_id,
              service_slug,
              service_name,
              customer_name,
              phone,
              address,
              preferred_date,
              issue_description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, booking_reference, status, created_at
          `,
          [
            bookingReference,
            userId,
            serviceSlug.trim(),
            serviceName.trim(),
            customerName.trim(),
            phone.trim(),
            address.trim(),
            preferredDate || null,
            issueDescription?.trim() || null,
          ]
        );
        break;
      } catch (error) {
        if (error.code === "23505" && error.constraint === "idx_bookings_booking_reference") {
          continue;
        }

        throw error;
      }
    }

    if (!result) {
      throw new Error("Could not generate a unique booking reference.");
    }

    return res.status(201).json({
      message: "Booking created successfully.",
      booking: {
        id: result.rows[0].id,
        referenceId: result.rows[0].booking_reference,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Booking insert failed.", error);
    return res.status(500).json({ message: "Failed to create booking." });
  }
});
