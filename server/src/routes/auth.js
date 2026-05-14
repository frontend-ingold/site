import express from "express";
import { query } from "../db/pool.js";
import { generateAuthToken, hashPassword, verifyPassword } from "../utils/auth.js";

export const authRouter = express.Router();

function sanitizeUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
  };
}

function extractBearerToken(request) {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

function generateResetCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

authRouter.post("/register", async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "fullName, email, and password are required." });
  }

  try {
    const existing = await query("SELECT id FROM users WHERE email = $1", [email.trim().toLowerCase()]);

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await hashPassword(password.trim());
    const userResult = await query(
      `
        INSERT INTO users (full_name, email, phone, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name, email, phone, created_at
      `,
      [
        fullName.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        passwordHash,
      ]
    );

    const token = generateAuthToken();
    await query("INSERT INTO user_sessions (user_id, token) VALUES ($1, $2)", [
      userResult.rows[0].id,
      token,
    ]);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: sanitizeUser(userResult.rows[0]),
    });
  } catch (error) {
    console.error("Registration failed.", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "email and password are required." });
  }

  try {
    const result = await query(
      `
        SELECT id, full_name, email, phone, password_hash, created_at
        FROM users
        WHERE email = $1
      `,
      [email.trim().toLowerCase()]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password.trim(), user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateAuthToken();
    await query("INSERT INTO user_sessions (user_id, token) VALUES ($1, $2)", [user.id, token]);

    return res.json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login failed.", error);
    return res.status(500).json({ message: "Failed to login." });
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({ message: "email is required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const userResult = await query("SELECT id, email FROM users WHERE email = $1", [normalizedEmail]);

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "No account found for this email." });
    }

    const user = userResult.rows[0];
    const resetCode = generateResetCode();

    await query("UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL", [
      user.id,
    ]);

    await query(
      `
        INSERT INTO password_reset_tokens (user_id, email, reset_code, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '15 minutes')
      `,
      [user.id, user.email, resetCode]
    );

    console.log(`Password reset code for ${user.email}: ${resetCode}`);

    return res.json({
      message: "Reset code generated. Check the server console for the development code.",
    });
  } catch (error) {
    console.error("Forgot password failed.", error);
    return res.status(500).json({ message: "Failed to generate reset code." });
  }
});

authRouter.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email?.trim() || !code?.trim() || !newPassword?.trim()) {
    return res.status(400).json({ message: "email, code, and newPassword are required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await query(
      `
        SELECT prt.id, prt.user_id
        FROM password_reset_tokens prt
        WHERE prt.email = $1
          AND prt.reset_code = $2
          AND prt.used_at IS NULL
          AND prt.expires_at > NOW()
        ORDER BY prt.created_at DESC
        LIMIT 1
      `,
      [normalizedEmail, code.trim()]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired reset code." });
    }

    const tokenRow = result.rows[0];
    const passwordHash = await hashPassword(newPassword.trim());

    await query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, tokenRow.user_id]);
    await query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1", [tokenRow.id]);
    await query("DELETE FROM user_sessions WHERE user_id = $1", [tokenRow.user_id]);

    return res.json({ message: "Password reset successful. Please login with your new password." });
  } catch (error) {
    console.error("Reset password failed.", error);
    return res.status(500).json({ message: "Failed to reset password." });
  }
});

authRouter.get("/me", async (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required." });
  }

  try {
    const result = await query(
      `
        SELECT u.id, u.full_name, u.email, u.phone, u.created_at
        FROM user_sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = $1
      `,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid session." });
    }

    return res.json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error("Fetch current user failed.", error);
    return res.status(500).json({ message: "Failed to fetch user." });
  }
});

authRouter.post("/logout", async (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(400).json({ message: "Authorization token is required." });
  }

  try {
    await query("DELETE FROM user_sessions WHERE token = $1", [token]);
    return res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout failed.", error);
    return res.status(500).json({ message: "Failed to logout." });
  }
});
