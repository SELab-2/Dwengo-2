import { seedDatabase } from './seedDatabase';

seedDatabase().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
