import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { IDatasource } from "../datasourceInterface";

export class DatasourceTypeORM implements IDatasource {
    // Connection for the TypeORM - postgres database
    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings = DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
        "postgres",
        5432, // 5433 for development docker, 5432 for production docker (on server)
        "postgres",
        "postgres",
        "dwengo-database",
        true,
    );

    // Promise of the TypeORM DataSource object
    // This object is needed for the repositories to be able to ask queries.
    protected static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(this.datasourceConnectionSettings);

    public static getDataSource(): Promise<DataSource> {
        return this.datasourcePromise;
    }
}
