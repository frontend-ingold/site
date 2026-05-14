import { pool } from "./pool.js";
import { createBookingsTableSql } from "./schema.js";

export async function ensureDatabase() {
  await pool.query(createBookingsTableSql);
}
