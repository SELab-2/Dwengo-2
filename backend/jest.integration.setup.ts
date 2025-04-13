import { server } from './src/app'; // Import server from app.ts
import log4js from "log4js";
import { logger } from './src/config/logger';
import { DatasourceTypeORMSingleton } from './src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMSingleton';
import { DataSource } from 'typeorm';
import { DatasourceTypeORM } from './src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORM';

export async function clearDatabase(dataSource: DataSource): Promise<void> {
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
        await dataSource.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`);
    }
}

afterEach(async () => {
    const dataSource = await DatasourceTypeORM.getDataSource();
    await clearDatabase(dataSource);
});

afterAll(async () => {
    logger.info("Shutting down test application...");
    await new Promise<void>((resolve) => {
        server.close(async () => {
            await DatasourceTypeORMSingleton.shutdownDatabase();
            logger.info("Test HTTP server closed");
            await new Promise<void>((resolveShutdown) => {
                log4js.shutdown(() => {
                    logger.info("Logger shut down");
                    resolveShutdown();
                });
            });
            resolve();
        });
    });
});
