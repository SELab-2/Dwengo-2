import { clearDatabase } from './clearDatabase';


// This file is not used in the normal flow of the application, but can be run manually to clear the database using the following command:
// docker-compose exec backend npm run clear:db
clearDatabase().catch((err) => {
  console.error('Failed to clear database:', err);
  process.exit(1);
});
