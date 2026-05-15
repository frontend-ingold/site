import { handleRequest } from '../src/app.js';
import { initializeDatabase } from '../src/db.js';

let initialized = false;

async function ensureDatabaseReady() {
  if (initialized) {
    return;
  }

  await initializeDatabase();
  initialized = true;
}

export default async function handler(req, res) {
  await ensureDatabaseReady();
  return handleRequest(req, res);
}
