import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { isAllowedOrigin } from './cors.js';
import { createOrder, getOrdersByUserId, getPageData, getUserPasswordHint, loginUser, registerUser, updateUserProfile } from './repository.js';
import { pool } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

app.get('/api/health', async (_request, response) => {
  await pool.query('SELECT 1');
  response.json({ ok: true });
});

app.get('/api/page-data', async (_request, response) => {
  const pageData = await getPageData();
  response.json(pageData);
});

app.get('/api/categories', async (_request, response) => {
  const pageData = await getPageData();
  response.json(pageData.categories);
});

app.get('/api/products', async (request, response) => {
  const pageData = await getPageData();
  const group = request.query.group;
  response.json(group === 'deal_month' ? pageData.dealMonthProducts : pageData.products);
});

app.get('/api/vendors', async (_request, response) => {
  const pageData = await getPageData();
  response.json(pageData.vendors);
});

app.get('/api/articles', async (_request, response) => {
  const pageData = await getPageData();
  response.json(pageData.articles);
});

app.get('/api/navigation', async (_request, response) => {
  const pageData = await getPageData();
  response.json(pageData.navigation);
});

app.post('/api/users', async (request, response) => {
  const { action } = request.query;

  if (action === 'register') {
    const user = await registerUser(request.body);
    if (!user) {
      response.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    response.status(201).json(user);
    return;
  }

  if (action === 'login') {
    const user = await loginUser(request.body);
    if (!user) {
      response.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    response.status(200).json(user);
    return;
  }

  if (action === 'forgot') {
    const passwordHint = await getUserPasswordHint(request.body.email ?? '');
    if (!passwordHint) {
      response.status(404).json({ error: 'No account found with that email.' });
      return;
    }

    response.status(200).json({ passwordHint });
    return;
  }

  response.status(400).json({ error: 'Invalid users action.' });
});

app.patch('/api/users', async (request, response) => {
  const updatedUser = await updateUserProfile(request.body);
  if (!updatedUser) {
    response.status(404).json({ error: 'User not found.' });
    return;
  }

  response.status(200).json(updatedUser);
});

app.get('/api/orders', async (request, response) => {
  const userId = Number(request.query.userId);
  if (!userId) {
    response.status(400).json({ error: 'userId is required.' });
    return;
  }

  const orders = await getOrdersByUserId(userId);
  response.status(200).json(orders);
});

app.post('/api/orders', async (request, response) => {
  const order = await createOrder(request.body);
  response.status(201).json(order);
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('API startup failed:', error);
  process.exit(1);
});
