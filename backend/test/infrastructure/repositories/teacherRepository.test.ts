import { DatasourceTypeORMConnectionSettings } from "../../../src/infrastructure/database/data/data_sources/datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "../../../src/infrastructure/database/data/data_sources/datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMPostgreSQLSingleton } from "../../../src/infrastructure/database/data/data_sources/datasourceTypeORMSingleton";

beforeAll(async (): Promise<void> => {
    const connectionSettings: DatasourceTypeORMConnectionSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
        "postgres",
        5433, // TODO: docker?
        "postgres",
        "postgres",
        "dwengo-test-database",
        true,       // Synchronize
        false,      // Logging
        "database", // Host,
        true        // DropSchema
    );
    await DatasourceTypeORMPostgreSQLSingleton.getInstance(connectionSettings);
});

afterAll(async (): Promise<void> => {
    await DatasourceTypeORMPostgreSQLSingleton.shutdownDatabase();
});

describe("Teacher Repository: Create", (): void => {

});
