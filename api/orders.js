import { applyCors } from './cors.js';
import { createOrder, getOrdersByUserId } from './repository.js';

export default async function handler(request, response) {
  applyCors(request, response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  try {
    if (request.method === 'GET') {
      const userId = Number(request.query.userId);
      if (!userId) {
        response.status(400).json({ error: 'userId is required.' });
        return;
      }

      const orders = await getOrdersByUserId(userId);
      response.status(200).json(orders);
      return;
    }

    if (request.method === 'POST') {
      const order = await createOrder(request.body);
      response.status(201).json(order);
      return;
    }

    response.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Orders API failed:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
