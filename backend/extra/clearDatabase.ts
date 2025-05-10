/**
 * This function clears the database by truncating all tables and resetting their identities.
 * It is useful for development and testing purposes, especially when you want to start with a clean slate.
 * It is also used in the `runSeedDb.ts` file to clear the database before seeding it with test data.
 * You can manually run this as a script using the following command:
 * $ docker-compose exec backend npm run db:clear
 */


import { DataSource } from 'typeorm';
import { DatasourceTypeORM } from '../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';

export async function clearDatabase(): Promise<void> {
  const connection: DataSource = await DatasourceTypeORM['datasourcePromise'];

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
        await connection.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
    }

  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Error during DB clear:', err);
    throw err;
  } finally {
    await queryRunner.release();
  }
}

// Run configuration (only executed when this file is run directly)
if (require.main === module) {
  clearDatabase()
    .then(() => {
      console.log('Database cleared successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Failed to clear database:', err);
      process.exit(1);
    });
}