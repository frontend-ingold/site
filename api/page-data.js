import { applyCors } from './cors.js';
import { getPageData } from './repository.js';

export default async function handler(request, response) {
  applyCors(request, response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  try {
    const pageData = await getPageData();
    response.status(200).json(pageData);
  } catch (error) {
    console.error('GET /api/page-data failed:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
