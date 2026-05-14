import { pool } from "../config/db.js";

function parseMoney(value) {
  return Number(String(value ?? "0").replace(/[^0-9.-]/g, "")) || 0;
}

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2);
}

function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `VOG-${datePart}-${randomPart}`;
}

function generateTrackingNumber() {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TRK-${randomPart}`;
}

function getEstimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 6);
  return date.toISOString().slice(0, 10);
}

function buildTrackingSteps(status) {
  const normalizedStatus = String(status ?? "confirmed").toLowerCase();
  const activeIndex = normalizedStatus === "delivered"
    ? 3
    : normalizedStatus === "shipped"
      ? 2
      : normalizedStatus === "processing"
        ? 1
        : 0;

  return [
    { label: "Order placed", status: activeIndex >= 0 ? "complete" : "upcoming" },
    { label: "Processing", status: activeIndex >= 1 ? "complete" : "upcoming" },
    { label: "Shipped", status: activeIndex >= 2 ? "complete" : "upcoming" },
    { label: "Delivered", status: activeIndex >= 3 ? "complete" : "upcoming" }
  ];
}

async function ensureOrdersTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_orders (
      id BIGSERIAL PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      tracking_number TEXT NOT NULL UNIQUE,
      contact TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      country TEXT NOT NULL,
      address TEXT NOT NULL,
      apartment TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      newsletter BOOLEAN NOT NULL DEFAULT FALSE,
      save_info BOOLEAN NOT NULL DEFAULT FALSE,
      note TEXT,
      payment_method TEXT NOT NULL CHECK (payment_method IN ('card', 'cod')),
      card_last4 TEXT,
      currency_code TEXT NOT NULL DEFAULT 'USD',
      subtotal NUMERIC(10,2) NOT NULL,
      discount NUMERIC(10,2) NOT NULL DEFAULT 0,
      shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
      total NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      estimated_delivery DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE customer_orders
    ADD COLUMN IF NOT EXISTS currency_code TEXT NOT NULL DEFAULT 'USD'
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customer_order_items (
      id BIGSERIAL PRIMARY KEY,
      order_id BIGINT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
      product_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      price NUMERIC(10,2) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      image_url TEXT,
      option_label TEXT,
      option_value TEXT,
      line_total NUMERIC(10,2) NOT NULL
    )
  `);
}

function mapOrder(orderRow, itemRows) {
  return {
    orderNumber: orderRow.order_number,
    trackingNumber: orderRow.tracking_number,
    contact: orderRow.contact,
    firstName: orderRow.first_name,
    lastName: orderRow.last_name,
    country: orderRow.country,
    address: orderRow.address,
    apartment: orderRow.apartment,
    city: orderRow.city,
    state: orderRow.state,
    zipCode: orderRow.zip_code,
    newsletter: orderRow.newsletter,
    saveInfo: orderRow.save_info,
    note: orderRow.note,
    paymentMethod: orderRow.payment_method,
    currencyCode: orderRow.currency_code ?? "USD",
    subtotal: formatMoney(orderRow.subtotal),
    discount: formatMoney(orderRow.discount),
    shipping: formatMoney(orderRow.shipping),
    total: formatMoney(orderRow.total),
    status: orderRow.status,
    estimatedDelivery: orderRow.estimated_delivery,
    createdAt: orderRow.created_at,
    itemCount: itemRows.reduce((sum, item) => sum + item.quantity, 0),
    steps: buildTrackingSteps(orderRow.status),
    items: itemRows.map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      category: item.category,
      price: formatMoney(item.price),
      quantity: item.quantity,
      image: item.image_url,
      optionLabel: item.option_label,
      optionValue: item.option_value,
      lineTotal: formatMoney(item.line_total)
    }))
  };
}

export async function createOrder(request, response) {
  await ensureOrdersTables();

  const {
    contact,
    newsletter,
    country,
    firstName,
    lastName,
    address,
    apartment,
    city,
    state,
    zipCode,
    saveInfo,
    note,
    paymentMethod,
    cardNumber,
    currencyCode,
    subtotal,
    discount,
    shipping,
    total,
    items
  } = request.body ?? {};

  const normalizedItems = Array.isArray(items) ? items : [];
  const normalizedContact = String(contact ?? "").trim();
  const normalizedCountry = String(country ?? "").trim();
  const normalizedAddress = String(address ?? "").trim();
  const normalizedCity = String(city ?? "").trim();
  const normalizedState = String(state ?? "").trim();
  const normalizedZipCode = String(zipCode ?? "").trim();
  const normalizedPaymentMethod = String(paymentMethod ?? "").trim().toLowerCase();
  const normalizedCurrencyCode = ["USD", "EUR", "INR"].includes(String(currencyCode ?? "").trim().toUpperCase())
    ? String(currencyCode).trim().toUpperCase()
    : "USD";

  if (
    !normalizedContact ||
    !normalizedCountry ||
    !normalizedAddress ||
    !normalizedCity ||
    !normalizedState ||
    !normalizedZipCode ||
    !normalizedItems.length ||
    !["card", "cod"].includes(normalizedPaymentMethod)
  ) {
    return response.status(400).json({
      message: "Please provide order items, contact details, address, and payment method."
    });
  }

  const numericSubtotal = parseMoney(subtotal);
  const numericDiscount = parseMoney(discount);
  const numericShipping = parseMoney(shipping);
  const numericTotal = parseMoney(total);
  const computedSubtotal = normalizedItems.reduce((sum, item) => {
    const price = parseMoney(item.price);
    const quantity = Math.max(1, Number(item.quantity) || 1);
    return sum + price * quantity;
  }, 0);

  if (Math.abs(computedSubtotal - numericSubtotal) > 0.01) {
    return response.status(400).json({
      message: "Order subtotal does not match submitted items."
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let orderNumber = generateOrderNumber();
    let trackingNumber = generateTrackingNumber();
    let uniqueFound = false;

    for (let attempt = 0; attempt < 5 && !uniqueFound; attempt += 1) {
      const existingResult = await client.query(
        `SELECT 1 FROM customer_orders WHERE order_number = $1 OR tracking_number = $2 LIMIT 1`,
        [orderNumber, trackingNumber]
      );

      if (existingResult.rowCount === 0) {
        uniqueFound = true;
      } else {
        orderNumber = generateOrderNumber();
        trackingNumber = generateTrackingNumber();
      }
    }

    if (!uniqueFound) {
      throw new Error("Could not generate a unique order number.");
    }

    const orderInsertResult = await client.query(
      `
        INSERT INTO customer_orders (
          order_number,
          tracking_number,
          contact,
          first_name,
          last_name,
          country,
          address,
          apartment,
          city,
          state,
          zip_code,
          newsletter,
          save_info,
          note,
          payment_method,
          card_last4,
          currency_code,
          subtotal,
          discount,
          shipping,
          total,
          status,
          estimated_delivery
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
        )
        RETURNING *
      `,
      [
        orderNumber,
        trackingNumber,
        normalizedContact,
        String(firstName ?? "").trim(),
        String(lastName ?? "").trim(),
        normalizedCountry,
        normalizedAddress,
        String(apartment ?? "").trim(),
        normalizedCity,
        normalizedState,
        normalizedZipCode,
        Boolean(newsletter),
        Boolean(saveInfo),
        String(note ?? "").trim(),
        normalizedPaymentMethod,
        normalizedPaymentMethod === "card" ? String(cardNumber ?? "").replace(/\D/g, "").slice(-4) : null,
        normalizedCurrencyCode,
        numericSubtotal,
        numericDiscount,
        numericShipping,
        numericTotal,
        normalizedPaymentMethod === "card" ? "confirmed" : "processing",
        getEstimatedDeliveryDate()
      ]
    );

    const orderRow = orderInsertResult.rows[0];

    for (const item of normalizedItems) {
      const price = parseMoney(item.price);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const lineTotal = price * quantity;

      await client.query(
        `
          INSERT INTO customer_order_items (
            order_id,
            product_id,
            name,
            category,
            price,
            quantity,
            image_url,
            option_label,
            option_value,
            line_total
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          orderRow.id,
          item.productId ? String(item.productId) : null,
          String(item.name ?? "").trim(),
          String(item.category ?? "").trim(),
          price,
          quantity,
          String(item.image ?? "").trim(),
          String(item.optionLabel ?? "").trim(),
          String(item.optionValue ?? "").trim(),
          lineTotal
        ]
      );
    }

    const itemResult = await client.query(
      `SELECT * FROM customer_order_items WHERE order_id = $1 ORDER BY id ASC`,
      [orderRow.id]
    );

    await client.query("COMMIT");

    return response.status(201).json({
      order: mapOrder(orderRow, itemResult.rows)
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create order", error);
    return response.status(500).json({
      message: "Failed to create order"
    });
  } finally {
    client.release();
  }
}

export async function getOrderByNumber(request, response) {
  try {
    await ensureOrdersTables();

    const { orderNumber } = request.params;

    const orderResult = await pool.query(
      `SELECT * FROM customer_orders WHERE order_number = $1`,
      [orderNumber]
    );

    if (orderResult.rowCount === 0) {
      return response.status(404).json({
        message: "Order not found"
      });
    }

    const orderRow = orderResult.rows[0];
    const itemResult = await pool.query(
      `SELECT * FROM customer_order_items WHERE order_id = $1 ORDER BY id ASC`,
      [orderRow.id]
    );

    return response.json({
      order: mapOrder(orderRow, itemResult.rows)
    });
  } catch (error) {
    console.error("Failed to fetch order", error);
    return response.status(500).json({
      message: "Failed to fetch order"
    });
  }
}
