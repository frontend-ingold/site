import pg from 'pg';

const { Pool } = pg;

let poolInstance;

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required.');
  }

  return connectionString;
}

function getPool() {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: getConnectionString(),
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return poolInstance;
}

export const pool = new Proxy(
  {},
  {
    get(_, property) {
      const target = getPool();
      const value = target[property];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  },
);

export async function initializeDatabase() {
  const database = getPool();

  await database.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS table_bookings (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      booking_date DATE NOT NULL,
      booking_time TIME NOT NULL,
      guest_count TEXT NOT NULL,
      special_request TEXT DEFAULT '',
      source TEXT DEFAULT 'website',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await database.query(`
    CREATE TABLE IF NOT EXISTS delivery_requests (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      items TEXT NOT NULL,
      order_total NUMERIC(10,2) DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'cod',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_reference TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'placed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await database.query(`ALTER TABLE table_bookings ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id) ON DELETE CASCADE;`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS order_total NUMERIC(10,2) DEFAULT 0;`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cod';`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS payment_reference TEXT DEFAULT '';`);
  await database.query(`ALTER TABLE delivery_requests ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'placed';`);
}
