import { DatasourceTypeORM } from '../src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';


async function wipeDatabase() {
  try {
    // Get DataSource from your singleton
    const dataSourceInstance = await DatasourceTypeORM['datasourcePromise'];

    const queryRunner = dataSourceInstance.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const disableFK = 'SET session_replication_role = replica;';
    const enableFK = 'SET session_replication_role = DEFAULT;';

    const tables = dataSourceInstance.entityMetadatas.map((meta) => `"${meta.tableName}"`);

    await queryRunner.query(disableFK);
    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
    }
    await queryRunner.query(enableFK);

    await queryRunner.commitTransaction();
    console.log('Database wiped successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error wiping database:', error);
    process.exit(1);
  }
}

wipeDatabase();
