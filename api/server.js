import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { isAllowedOrigin } from './cors.js';
import { getPageData } from './repository.js';
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
