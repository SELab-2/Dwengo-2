import { DataSource } from "typeorm"
import { IDatasourceInitialize } from "./datasourceInitializeInterface";
import { DatasourceTypeORMPostgreSQLSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";

export class DatasourceInitializePostgreSQL implements IDatasourceInitialize {

    private datasourceConnectionSettings: DatasourceTypeORMConnectionSettings = 
        DatasourceTypeORMConnectionSettingsFactory
        .createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
    
    private datasource?: DataSource;
 
    async initialize_database(): Promise<void> {
        console.log("Initializing Dwengo's PostgreSQL database through TypeORM");
        this.datasource = await DatasourceTypeORMPostgreSQLSingleton.getInstance(this.datasourceConnectionSettings);
    }

    async shutdown_database(): Promise<void> {
        console.log("Shutting down Dwengo's PostgreSQL database through TypeORM");
        await DatasourceTypeORMPostgreSQLSingleton.shutdownDatabase();
    }

}
