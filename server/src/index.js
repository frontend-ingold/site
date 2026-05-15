import crypto from 'node:crypto';
import http from 'node:http';
import { comparePassword, extractBearerToken, hashPassword, signToken, verifyToken } from './auth.js';
import { initializeDatabase, pool } from './db.js';

const PORT = process.env.PORT || 5000;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });

    req.on('error', reject);
  });
}

async function authenticate(req) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new Error('Authentication required.');
  }

  const payload = verifyToken(token);
  const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [payload.id]);

  if (result.rowCount === 0) {
    throw new Error('User not found.');
  }

  return result.rows[0];
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.url === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, { status: 'ok', service: 'restu-booking-server' });
    return;
  }

  if (req.url === '/api/auth/register' && req.method === 'POST') {
    try {
      const { name, email, password } = await readJsonBody(req);

      if (!name || !email || !password) {
        sendJson(res, 400, { message: 'Name, email, and password are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

      if (existing.rowCount > 0) {
        sendJson(res, 409, { message: 'An account with this email already exists.' });
        return;
      }

      const passwordHash = await hashPassword(password);
      const result = await pool.query(
        `
          INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, name, email, created_at;
        `,
        [name.trim(), normalizedEmail, passwordHash],
      );

      const user = result.rows[0];
      sendJson(res, 201, {
        message: 'Registration successful.',
        token: signToken(user),
        user,
      });
      return;
    } catch (error) {
      sendJson(res, 500, { message: 'Failed to register user.', error: error.message });
      return;
    }
  }

  if (req.url === '/api/auth/login' && req.method === 'POST') {
    try {
      const { email, password } = await readJsonBody(req);

      if (!email || !password) {
        sendJson(res, 400, { message: 'Email and password are required.' });
        return;
      }

      const result = await pool.query(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
        [email.trim().toLowerCase()],
      );

      if (result.rowCount === 0) {
        sendJson(res, 401, { message: 'Invalid email or password.' });
        return;
      }

      const user = result.rows[0];
      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        sendJson(res, 401, { message: 'Invalid email or password.' });
        return;
      }

      sendJson(res, 200, {
        message: 'Login successful.',
        token: signToken(user),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      });
      return;
    } catch (error) {
      sendJson(res, 500, { message: 'Failed to log in.', error: error.message });
      return;
    }
  }

  if (req.url === '/api/auth/forgot-password' && req.method === 'POST') {
    try {
      const { email } = await readJsonBody(req);

      if (!email) {
        sendJson(res, 400, { message: 'Email is required.' });
        return;
      }

      const result = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);

      if (result.rowCount === 0) {
        sendJson(res, 200, { message: 'If the account exists, a reset code has been created.' });
        return;
      }

      const userId = result.rows[0].id;
      const resetToken = crypto.randomBytes(4).toString('hex').toUpperCase();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

      await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL', [userId]);
      await pool.query(
        `
          INSERT INTO password_reset_tokens (user_id, token, expires_at)
          VALUES ($1, $2, $3)
        `,
        [userId, resetToken, expiresAt],
      );

      sendJson(res, 200, {
        message: 'Reset code created successfully.',
        resetToken,
      });
      return;
    } catch (error) {
      sendJson(res, 500, { message: 'Failed to create reset token.', error: error.message });
      return;
    }
  }

  if (req.url === '/api/auth/reset-password' && req.method === 'POST') {
    try {
      const { token, password } = await readJsonBody(req);

      if (!token || !password) {
        sendJson(res, 400, { message: 'Reset code and new password are required.' });
        return;
      }

      const result = await pool.query(
        `
          SELECT id, user_id, expires_at, used_at
          FROM password_reset_tokens
          WHERE token = $1
        `,
        [token.trim()],
      );

      if (result.rowCount === 0) {
        sendJson(res, 404, { message: 'Reset code not found.' });
        return;
      }

      const reset = result.rows[0];

      if (reset.used_at) {
        sendJson(res, 400, { message: 'Reset code has already been used.' });
        return;
      }

      if (new Date(reset.expires_at).getTime() < Date.now()) {
        sendJson(res, 400, { message: 'Reset code has expired.' });
        return;
      }

      const passwordHash = await hashPassword(password);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, reset.user_id]);
      await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [reset.id]);

      sendJson(res, 200, { message: 'Password reset successful.' });
      return;
    } catch (error) {
      sendJson(res, 500, { message: 'Failed to reset password.', error: error.message });
      return;
    }
  }

  if (req.url === '/api/auth/me' && req.method === 'GET') {
    try {
      const user = await authenticate(req);
      sendJson(res, 200, { user });
      return;
    } catch (error) {
      sendJson(res, 401, { message: error.message });
      return;
    }
  }

  if (req.url === '/api/my/bookings' && req.method === 'GET') {
    try {
      const user = await authenticate(req);
      const result = await pool.query(
        `
          SELECT id, booking_date, booking_time, guest_count, special_request, source, created_at
          FROM table_bookings
          WHERE user_id = $1
          ORDER BY created_at DESC
        `,
        [user.id],
      );
      sendJson(res, 200, { bookings: result.rows });
      return;
    } catch (error) {
      sendJson(res, 401, { message: error.message });
      return;
    }
  }

  if (req.url === '/api/my/deliveries' && req.method === 'GET') {
    try {
      const user = await authenticate(req);
      const result = await pool.query(
        `
          SELECT id, customer_name, phone, address, items, order_total, status, created_at
          FROM delivery_requests
          WHERE user_id = $1
          ORDER BY created_at DESC
        `,
        [user.id],
      );
      sendJson(res, 200, { deliveries: result.rows });
      return;
    } catch (error) {
      sendJson(res, 401, { message: error.message });
      return;
    }
  }

  if (req.url === '/api/bookings' && req.method === 'POST') {
    try {
      const user = await authenticate(req);
      const { date, time, guests, request = '', source = 'website' } = await readJsonBody(req);

      if (!date || !time || !guests) {
        sendJson(res, 400, { message: 'Date, time, and guests are required.' });
        return;
      }

      const result = await pool.query(
        `
          INSERT INTO table_bookings (user_id, booking_date, booking_time, guest_count, special_request, source)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, booking_date, booking_time, guest_count, special_request, source, created_at;
        `,
        [user.id, date, time, guests, request, source],
      );

      sendJson(res, 201, { message: 'Booking created successfully.', booking: result.rows[0] });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(res, status, { message: status === 401 ? error.message : 'Failed to create booking.', error: error.message });
      return;
    }
  }

  if (req.url === '/api/deliveries' && req.method === 'POST') {
    try {
      const user = await authenticate(req);
      const { name, phone, address, items, orderTotal = 0 } = await readJsonBody(req);

      if (!name || !phone || !address || !items) {
        sendJson(res, 400, { message: 'Name, phone, address, and items are required.' });
        return;
      }

      const serializedItems = Array.isArray(items) ? JSON.stringify(items) : items;

      const result = await pool.query(
        `
          INSERT INTO delivery_requests (user_id, customer_name, phone, address, items, order_total, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, customer_name, phone, address, items, order_total, status, created_at;
        `,
        [user.id, name, phone, address, serializedItems, Number(orderTotal) || 0, 'placed'],
      );

      sendJson(res, 201, { message: 'Delivery request created successfully.', delivery: result.rows[0] });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(res, status, {
        message: status === 401 ? error.message : 'Failed to create delivery request.',
        error: error.message,
      });
      return;
    }
  }

  sendJson(res, 404, {
    message: 'Route not found.',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/me',
      '/api/my/bookings',
      '/api/my/deliveries',
      '/api/bookings',
      '/api/deliveries',
    ],
  });
});

initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
