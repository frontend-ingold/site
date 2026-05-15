import { handleRequest } from '../src/app.js';
import { initializeDatabase } from '../src/db.js';

let initialized = false;

export async function handleApiRequest(req, res) {
  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }

  return handleRequest(req, res);
}
