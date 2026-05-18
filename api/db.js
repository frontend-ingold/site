import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

function normalizeDatabaseUrl(connectionString) {
  const parsedUrl = new URL(connectionString);
  const sslMode = parsedUrl.searchParams.get('sslmode');
  const hasCompatFlag = parsedUrl.searchParams.has('uselibpqcompat');

  if (sslMode === 'require' && !hasCompatFlag) {
    parsedUrl.searchParams.set('uselibpqcompat', 'true');
  }

  return parsedUrl.toString();
}

export const pool = new Pool({
  connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL),
  ssl: { rejectUnauthorized: false }
});
