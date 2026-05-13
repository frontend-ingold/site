import crypto from "crypto";
import { pool } from "../config/db.js";

const SESSION_DURATION_DAYS = 30;

async function ensureAuthTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return {
    salt,
    hash: derivedKey
  };
}

function verifyPassword(password, salt, expectedHash) {
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  const left = Buffer.from(derivedKey, "hex");
  const right = Buffer.from(expectedHash, "hex");

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function buildSessionExpiry() {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_DURATION_DAYS);
  return date;
}

function mapUser(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email
  };
}

async function createSession(client, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = buildSessionExpiry();

  await client.query(
    `
      INSERT INTO user_sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
    `,
    [userId, token, expiresAt.toISOString()]
  );

  return {
    token,
    expiresAt: expiresAt.toISOString()
  };
}

export async function registerUser(request, response) {
  try {
    await ensureAuthTables();

    const firstName = String(request.body?.firstName ?? "").trim();
    const lastName = String(request.body?.lastName ?? "").trim();
    const email = String(request.body?.email ?? "").trim().toLowerCase();
    const password = String(request.body?.password ?? "");
    const confirmPassword = String(request.body?.confirmPassword ?? "");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return response.status(400).json({
        message: "Please complete all required fields."
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        message: "Password must be at least 6 characters."
      });
    }

    if (password !== confirmPassword) {
      return response.status(400).json({
        message: "Passwords do not match."
      });
    }

    const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existingUser.rowCount > 0) {
      return response.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const passwordData = hashPassword(password);
      const userResult = await client.query(
        `
          INSERT INTO users (first_name, last_name, email, password_hash, password_salt)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, first_name, last_name, email
        `,
        [firstName, lastName, email, passwordData.hash, passwordData.salt]
      );

      const session = await createSession(client, userResult.rows[0].id);
      await client.query("COMMIT");

      return response.status(201).json({
        user: mapUser(userResult.rows[0]),
        session
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to register user", error);
    return response.status(500).json({
      message: "Failed to create account."
    });
  }
}

export async function loginUser(request, response) {
  try {
    await ensureAuthTables();

    const email = String(request.body?.email ?? "").trim().toLowerCase();
    const password = String(request.body?.password ?? "");

    if (!email || !password) {
      return response.status(400).json({
        message: "Please enter your email and password."
      });
    }

    const userResult = await pool.query(
      `
        SELECT id, first_name, last_name, email, password_hash, password_salt
        FROM users
        WHERE email = $1
      `,
      [email]
    );

    if (userResult.rowCount === 0) {
      return response.status(401).json({
        message: "Invalid email or password."
      });
    }

    const userRow = userResult.rows[0];
    const isValid = verifyPassword(password, userRow.password_salt, userRow.password_hash);

    if (!isValid) {
      return response.status(401).json({
        message: "Invalid email or password."
      });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const session = await createSession(client, userRow.id);
      await client.query("COMMIT");

      return response.json({
        user: mapUser(userRow),
        session
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed to login user", error);
    return response.status(500).json({
      message: "Failed to login."
    });
  }
}

export async function getSessionUser(request, response) {
  try {
    await ensureAuthTables();

    const token = String(request.headers.authorization ?? "")
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (!token) {
      return response.status(401).json({
        message: "Missing session token."
      });
    }

    const sessionResult = await pool.query(
      `
        SELECT
          session.id,
          session.expires_at,
          user.id AS user_id,
          user.first_name,
          user.last_name,
          user.email
        FROM user_sessions session
        INNER JOIN users user ON user.id = session.user_id
        WHERE session.token = $1
      `,
      [token]
    );

    if (sessionResult.rowCount === 0) {
      return response.status(401).json({
        message: "Session not found."
      });
    }

    const session = sessionResult.rows[0];
    if (new Date(session.expires_at) < new Date()) {
      await pool.query(`DELETE FROM user_sessions WHERE id = $1`, [session.id]);
      return response.status(401).json({
        message: "Session expired."
      });
    }

    return response.json({
      user: mapUser({
        id: session.user_id,
        first_name: session.first_name,
        last_name: session.last_name,
        email: session.email
      })
    });
  } catch (error) {
    console.error("Failed to fetch session user", error);
    return response.status(500).json({
      message: "Failed to fetch session."
    });
  }
}

export async function logoutUser(request, response) {
  try {
    await ensureAuthTables();
    const token = String(request.headers.authorization ?? "")
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (token) {
      await pool.query(`DELETE FROM user_sessions WHERE token = $1`, [token]);
    }

    return response.status(204).send();
  } catch (error) {
    console.error("Failed to logout user", error);
    return response.status(500).json({
      message: "Failed to logout."
    });
  }
}

export async function requestPasswordReset(_request, response) {
  try {
    await ensureAuthTables();
    return response.json({
      message: "If an account exists for that email, a reset link has been prepared."
    });
  } catch (error) {
    console.error("Failed to request password reset", error);
    return response.status(500).json({
      message: "Failed to request password reset."
    });
  }
}
