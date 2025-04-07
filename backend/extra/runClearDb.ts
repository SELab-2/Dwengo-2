import { clearDatabase } from './clearDatabase';

clearDatabase().catch((err) => {
  console.error('Failed to clear database:', err);
  process.exit(1);
});
