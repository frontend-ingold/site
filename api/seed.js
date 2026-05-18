import { seedDatabase } from './seedDatabase.js';

seedDatabase({ closePool: true }).catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
