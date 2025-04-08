/**
 * This file is used to seed the database with test data. It is not used in the normal flow of the application,
 * but can be run manually to clear and then seed the database with test data using the following command:
 * $ docker-compose exec backend npm run db:seed
 * More information can be found in the seedDatabase.ts file.
 */

import { seedDatabase } from './seedDatabase';
import { clearDatabase } from './clearDatabase';

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
