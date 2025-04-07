import { DataSource } from 'typeorm';
import { DatasourceTypeORM } from '../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';

export async function clearDatabase(): Promise<void> {
  const connection: DataSource = await DatasourceTypeORM['datasourcePromise'];

  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query('SET session_replication_role = replica;');

    const tables = connection.entityMetadatas.map((meta) => `"${meta.tableName}"`);
    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
    }

    await queryRunner.query('SET session_replication_role = DEFAULT;');
    await queryRunner.commitTransaction();
    console.log('Database cleared successfully');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Error during DB clear:', err);
    throw err;
  } finally {
    await queryRunner.release();
    await connection.destroy();
  }
}
