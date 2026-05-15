import http from 'node:http';
import { handleRequest } from './app.js';
import { initializeDatabase } from './db.js';

const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    const server = http.createServer(handleRequest);

    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
