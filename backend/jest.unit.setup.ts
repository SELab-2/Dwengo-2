import { DatasourceTypeORMSingleton } from "./src/infrastructure/database/data/data_sources/typeorm/datasourceTypeORMSingleton"

afterEach(async () => {
    await DatasourceTypeORMSingleton.shutdownDatabase();
})