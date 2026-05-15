import crypto from 'node:crypto';
import { comparePassword, extractBearerToken, hashPassword, signToken, verifyToken } from './auth.js';
import { pool } from './db.js';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_ENABLED = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
const CORS_ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function getRequestPath(url = '/') {
  const pathname = new URL(url, 'http://localhost').pathname;
  return pathname.startsWith('/api') ? pathname : `/api${pathname}`;
}

function getGuestCountValue(guestCount) {
  if (typeof guestCount === 'string' && guestCount.includes('+')) {
    return Number.parseInt(guestCount, 10) || 8;
  }

  return Number.parseInt(guestCount, 10) || 0;
}

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (CORS_ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
    return true;
  }

  if (/^https:\/\/.+\.vercel\.app$/.test(origin)) {
    return true;
  }

  return false;
}

function getCorsHeaders(req) {
  const origin = req.headers.origin || '';

  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin || '*' : 'null',
    Vary: 'Origin',
  };
}

function sendJson(req, res, statusCode, payload) {
  res.writeHead(statusCode, getCorsHeaders(req));
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

function buildBasicAuthHeader(keyId, keySecret) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
}

async function createDeliveryRecord({
  userId,
  name,
  phone,
  address,
  items,
  orderTotal,
  paymentMethod,
  paymentStatus,
  paymentReference,
  status,
}) {
  const serializedItems = Array.isArray(items) ? JSON.stringify(items) : items;

  const result = await pool.query(
    `
      INSERT INTO delivery_requests (
        user_id,
        customer_name,
        phone,
        address,
        items,
        order_total,
        payment_method,
        payment_status,
        payment_reference,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        customer_name,
        phone,
        address,
        items,
        order_total,
        payment_method,
        payment_status,
        payment_reference,
        status,
        created_at;
    `,
    [
      userId,
      name,
      phone,
      address,
      serializedItems,
      Number(orderTotal) || 0,
      paymentMethod,
      paymentStatus,
      paymentReference,
      status,
    ],
  );

  return result.rows[0];
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

export async function handleRequest(req, res) {
  const requestPath = getRequestPath(req.url);

  if (req.method === 'OPTIONS') {
    sendJson(req, res, 204, {});
    return;
  }

  if (requestPath === '/api/health' && req.method === 'GET') {
    sendJson(req, res, 200, { status: 'ok', service: 'restu-booking-server' });
    return;
  }

  if (requestPath === '/api/bookings/availability' && req.method === 'GET') {
    try {
      const requestUrl = new URL(req.url, 'http://localhost');
      const date = requestUrl.searchParams.get('date') || '';
      const time = requestUrl.searchParams.get('time') || '';
      const guests = requestUrl.searchParams.get('guests') || '0';

      if (!date || !time || !guests) {
        sendJson(req, res, 400, { message: 'Date, time, and guests are required.' });
        return;
      }

      const requestedGuests = getGuestCountValue(guests);

      if (requestedGuests <= 0) {
        sendJson(req, res, 400, { message: 'A valid guest count is required.' });
        return;
      }

      const result = await pool.query(
        `
          SELECT guest_count
          FROM table_bookings
          WHERE booking_date = $1 AND booking_time = $2
        `,
        [date, time],
      );

      const capacity = 120;
      const reservedSeats = result.rows.reduce((sum, booking) => sum + getGuestCountValue(booking.guest_count), 0);
      const remainingSeats = Math.max(0, capacity - reservedSeats);
      const available = remainingSeats >= requestedGuests;

      sendJson(req, res, 200, {
        available,
        capacity,
        reservedSeats,
        remainingSeats,
        requestedGuests,
        message: available
          ? `${remainingSeats} seats are currently open for this slot.`
          : `Only ${remainingSeats} seats remain for this slot. Please choose another time.`,
      });
      return;
    } catch (error) {
      sendJson(req, res, 500, { message: 'Failed to check availability.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/payments/config' && req.method === 'GET') {
    sendJson(req, res, 200, {
      provider: 'razorpay',
      enabled: RAZORPAY_ENABLED,
      keyId: RAZORPAY_ENABLED ? RAZORPAY_KEY_ID : '',
    });
    return;
  }

  if (requestPath === '/api/auth/register' && req.method === 'POST') {
    try {
      const { name, email, password } = await readJsonBody(req);

      if (!name || !email || !password) {
        sendJson(req, res, 400, { message: 'Name, email, and password are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

      if (existing.rowCount > 0) {
        sendJson(req, res, 409, { message: 'An account with this email already exists.' });
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
      sendJson(req, res, 201, {
        message: 'Registration successful.',
        token: signToken(user),
        user,
      });
      return;
    } catch (error) {
      sendJson(req, res, 500, { message: 'Failed to register user.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/auth/login' && req.method === 'POST') {
    try {
      const { email, password } = await readJsonBody(req);

      if (!email || !password) {
        sendJson(req, res, 400, { message: 'Email and password are required.' });
        return;
      }

      const result = await pool.query(
        'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
        [email.trim().toLowerCase()],
      );

      if (result.rowCount === 0) {
        sendJson(req, res, 401, { message: 'Invalid email or password.' });
        return;
      }

      const user = result.rows[0];
      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        sendJson(req, res, 401, { message: 'Invalid email or password.' });
        return;
      }

      sendJson(req, res, 200, {
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
      sendJson(req, res, 500, { message: 'Failed to log in.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/auth/forgot-password' && req.method === 'POST') {
    try {
      const { email } = await readJsonBody(req);

      if (!email) {
        sendJson(req, res, 400, { message: 'Email is required.' });
        return;
      }

      const result = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);

      if (result.rowCount === 0) {
        sendJson(req, res, 200, { message: 'If the account exists, a reset code has been created.' });
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

      sendJson(req, res, 200, {
        message: 'Reset code created successfully.',
        resetToken,
      });
      return;
    } catch (error) {
      sendJson(req, res, 500, { message: 'Failed to create reset token.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/auth/reset-password' && req.method === 'POST') {
    try {
      const { token, password } = await readJsonBody(req);

      if (!token || !password) {
        sendJson(req, res, 400, { message: 'Reset code and new password are required.' });
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
        sendJson(req, res, 404, { message: 'Reset code not found.' });
        return;
      }

      const reset = result.rows[0];

      if (reset.used_at) {
        sendJson(req, res, 400, { message: 'Reset code has already been used.' });
        return;
      }

      if (new Date(reset.expires_at).getTime() < Date.now()) {
        sendJson(req, res, 400, { message: 'Reset code has expired.' });
        return;
      }

      const passwordHash = await hashPassword(password);
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, reset.user_id]);
      await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [reset.id]);

      sendJson(req, res, 200, { message: 'Password reset successful.' });
      return;
    } catch (error) {
      sendJson(req, res, 500, { message: 'Failed to reset password.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/auth/me' && req.method === 'GET') {
    try {
      const user = await authenticate(req);
      sendJson(req, res, 200, { user });
      return;
    } catch (error) {
      sendJson(req, res, 401, { message: error.message });
      return;
    }
  }

  if (requestPath === '/api/auth/profile' && req.method === 'POST') {
    try {
      const user = await authenticate(req);
      const { name, email } = await readJsonBody(req);

      if (!name || !email) {
        sendJson(req, res, 400, { message: 'Name and email are required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();

      if (!trimmedName) {
        sendJson(req, res, 400, { message: 'Name cannot be empty.' });
        return;
      }

      const existing = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [normalizedEmail, user.id]);

      if (existing.rowCount > 0) {
        sendJson(req, res, 409, { message: 'Another account already uses this email.' });
        return;
      }

      const result = await pool.query(
        `
          UPDATE users
          SET name = $1, email = $2
          WHERE id = $3
          RETURNING id, name, email, created_at;
        `,
        [trimmedName, normalizedEmail, user.id],
      );

      sendJson(req, res, 200, {
        message: 'Profile updated successfully.',
        user: result.rows[0],
      });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(req, res, status, { message: status === 401 ? error.message : 'Failed to update profile.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/my/bookings' && req.method === 'GET') {
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
      sendJson(req, res, 200, { bookings: result.rows });
      return;
    } catch (error) {
      sendJson(req, res, 401, { message: error.message });
      return;
    }
  }

  if (requestPath === '/api/my/deliveries' && req.method === 'GET') {
    try {
      const user = await authenticate(req);
      const result = await pool.query(
        `
          SELECT
            id,
            customer_name,
            phone,
            address,
            items,
            order_total,
            payment_method,
            payment_status,
            payment_reference,
            status,
            created_at
          FROM delivery_requests
          WHERE user_id = $1
          ORDER BY created_at DESC
        `,
        [user.id],
      );
      sendJson(req, res, 200, { deliveries: result.rows });
      return;
    } catch (error) {
      sendJson(req, res, 401, { message: error.message });
      return;
    }
  }

  if (requestPath === '/api/bookings' && req.method === 'POST') {
    try {
      const user = await authenticate(req);
      const { date, time, guests, request = '', source = 'website' } = await readJsonBody(req);

      if (!date || !time || !guests) {
        sendJson(req, res, 400, { message: 'Date, time, and guests are required.' });
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

      sendJson(req, res, 201, { message: 'Booking created successfully.', booking: result.rows[0] });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(req, res, status, { message: status === 401 ? error.message : 'Failed to create booking.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/payments/create-order' && req.method === 'POST') {
    try {
      await authenticate(req);

      if (!RAZORPAY_ENABLED) {
        sendJson(req, res, 503, { message: 'Online payments are not configured yet.' });
        return;
      }

      const { amount, receipt = `receipt_${Date.now()}` } = await readJsonBody(req);
      const normalizedAmount = Math.round(Number(amount) * 100);

      if (!normalizedAmount || normalizedAmount < 100) {
        sendJson(req, res, 400, { message: 'A valid amount is required to create a payment order.' });
        return;
      }

      const gatewayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: buildBasicAuthHeader(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: normalizedAmount,
          currency: 'INR',
          receipt,
          payment_capture: 1,
        }),
      });

      const gatewayData = await gatewayResponse.json();

      if (!gatewayResponse.ok) {
        throw new Error(gatewayData.error?.description || 'Failed to create payment order.');
      }

      sendJson(req, res, 201, {
        keyId: RAZORPAY_KEY_ID,
        order: gatewayData,
      });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(req, res, status, { message: status === 401 ? error.message : 'Failed to initialize payment.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/payments/verify' && req.method === 'POST') {
    try {
      const user = await authenticate(req);

      if (!RAZORPAY_ENABLED) {
        sendJson(req, res, 503, { message: 'Online payments are not configured yet.' });
        return;
      }

      const {
        name,
        phone,
        address,
        items,
        orderTotal = 0,
        paymentMethod = 'online',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = await readJsonBody(req);

      if (!name || !phone || !address || !items || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        sendJson(req, res, 400, { message: 'Payment verification details are incomplete.' });
        return;
      }

      if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
        sendJson(req, res, 400, { message: 'Payment signature verification failed.' });
        return;
      }

      const delivery = await createDeliveryRecord({
        userId: user.id,
        name,
        phone,
        address,
        items,
        orderTotal,
        paymentMethod: paymentMethod === 'upi' ? 'upi' : 'card',
        paymentStatus: 'paid',
        paymentReference: razorpayPaymentId,
        status: 'confirmed',
      });

      sendJson(req, res, 201, {
        message: 'Payment verified and order placed successfully.',
        delivery,
      });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(req, res, status, { message: status === 401 ? error.message : 'Failed to verify payment.', error: error.message });
      return;
    }
  }

  if (requestPath === '/api/deliveries' && req.method === 'POST') {
    try {
      const user = await authenticate(req);
      const { name, phone, address, items, orderTotal = 0, paymentMethod = 'cod' } = await readJsonBody(req);

      if (!name || !phone || !address || !items) {
        sendJson(req, res, 400, { message: 'Name, phone, address, and items are required.' });
        return;
      }

      const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'online';

      if (normalizedPaymentMethod !== 'cod') {
        sendJson(req, res, 400, { message: 'Online payments must be completed through the payment gateway flow.' });
        return;
      }

      const delivery = await createDeliveryRecord({
        userId: user.id,
        name,
        phone,
        address,
        items,
        orderTotal,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        paymentReference: '',
        status: 'placed',
      });

      sendJson(req, res, 201, { message: 'Delivery request created successfully.', delivery });
      return;
    } catch (error) {
      const status = error.message === 'Authentication required.' || error.message === 'User not found.' ? 401 : 500;
      sendJson(req, res, status, {
        message: status === 401 ? error.message : 'Failed to create delivery request.',
        error: error.message,
      });
      return;
    }
  }

  sendJson(req, res, 404, {
    message: 'Route not found.',
    endpoints: [
      '/api/health',
      '/api/payments/config',
      '/api/payments/create-order',
      '/api/payments/verify',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/me',
      '/api/auth/profile',
      '/api/my/bookings',
      '/api/my/deliveries',
      '/api/bookings',
      '/api/deliveries',
    ],
  });
}
