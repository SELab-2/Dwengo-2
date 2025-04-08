import { seedDatabase } from './seedDatabase';
import { clearDatabase } from './clearDatabase';

// This file is not used in the normal flow of the application, but can be run manually to clear and then seed the database with test data using the following command:
// docker-compose exec backend npm run seed:db

async function seed() {
  try {
    await clearDatabase();
    console.log('Database cleared successfully, now seeding...');
    await seedDatabase();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seed();
