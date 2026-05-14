import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;
let poolInstance = null;

export function getPool() {
  if (poolInstance) {
    return poolInstance;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  poolInstance = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return poolInstance;
}

export function query(text, params) {
  return getPool().query(text, params);
}

export async function closePool() {
  if (!poolInstance) {
    return;
  }

  await poolInstance.end();
  poolInstance = null;
}
