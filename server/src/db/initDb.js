import { query } from "./pool.js";
import { createBookingsTableSql } from "./schema.js";

export async function ensureDatabase() {
  await query(createBookingsTableSql);
}
