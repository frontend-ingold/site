import { app } from "../src/app.js";
import { ensureDatabase } from "../src/db/initDb.js";

let databaseReadyPromise;

async function ensureDatabaseOnce() {
  if (!databaseReadyPromise) {
    databaseReadyPromise = ensureDatabase().catch((error) => {
      databaseReadyPromise = null;
      throw error;
    });
  }

  return databaseReadyPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDatabaseOnce();
    return app(req, res);
  } catch (error) {
    console.error("Serverless startup failed.", error);
    return res.status(500).json({ message: "Server startup failed." });
  }
}
