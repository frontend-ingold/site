import { applyCors } from './cors.js';
import { pool } from './db.js';

export default async function handler(request, response) {
  applyCors(request, response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  try {
    await pool.query('SELECT 1');
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('GET /api/health failed:', error);
    response.status(500).json({ ok: false });
  }
}
