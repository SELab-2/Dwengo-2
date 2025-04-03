import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { IDatasource } from "../datasourceInterface";

export class DatasourceTypeORM implements IDatasource {
    // Connection for the TypeORM - postgres database
    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings =
        DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432, // 5433 for development docker, 5432 for production docker (on server)
            "postgres",
            "postgres",
            "dwengo-database",
            true,
            true,
        );

    // Promise of the TypeORM DataSource object
    // This object is needed for the repositories to be able to ask queries.
    private static _datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(
        this.datasourceConnectionSettings,
    );

    private static _datasource: DataSource | null = null; // Use a single DataSource for all instances of this class and its children

    private static async initialize() {
        // sets the _datasource field if it's not set yet
        if (!this._datasource) {
            // Does this by awaiting the datasourcePromise
            this._datasource = await this._datasourcePromise;
        }
    }

    protected get datasource(): DataSource {
        // gets the static _datasource field. If it's not initialized yet, it waits for the initialization
        DatasourceTypeORM.initialize();
        while (!DatasourceTypeORM._datasource) {
            // Wait until the async initialize function has finished
        }
        return DatasourceTypeORM._datasource;
    }
}
