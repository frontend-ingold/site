import { handleRequest } from '../src/app.js';
import { initializeDatabase } from '../src/db.js';

let initialized = false;

function requiresDatabase(url = '/') {
  const pathname = new URL(url, 'http://localhost').pathname;
  return !['/api/health', '/api/payments/config'].includes(pathname);
}

async function ensureDatabaseReady() {
  if (initialized) {
    return;
  }

  await initializeDatabase();
  initialized = true;
}

export default async function handler(req, res) {
  if (requiresDatabase(req.url)) {
    await ensureDatabaseReady();
  }

  return handleRequest(req, res);
}
