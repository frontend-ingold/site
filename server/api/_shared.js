import { handleRequest } from '../src/app.js';
import { initializeDatabase } from '../src/db.js';

let initialized = false;

function requiresDatabase(url = '/') {
  const pathname = new URL(url, 'http://localhost').pathname;
  return !['/api/health', '/api/payments/config'].includes(pathname);
}

async function ensureDatabaseReady(req) {
  if (!requiresDatabase(req.url) || initialized) {
    return;
  }

  await initializeDatabase();
  initialized = true;
}

export async function handleApiRequest(req, res) {
  await ensureDatabaseReady(req);
  return handleRequest(req, res);
}
