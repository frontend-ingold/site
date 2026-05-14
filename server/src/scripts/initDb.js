import { ensureDatabase } from "../db/initDb.js";
import { closePool } from "../db/pool.js";

try {
  await ensureDatabase();
  console.log("Database tables are ready.");
} catch (error) {
  console.error("Failed to initialize database.", error);
  process.exitCode = 1;
} finally {
  await closePool();
}
