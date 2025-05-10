import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { IDatasource } from "../datasourceInterface";

const host = process.env.CI === "true" ? "localhost" : "database";

export class DatasourceTypeORM implements IDatasource {
    // Connection for the TypeORM - postgres database
    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings =
        DatasourceTypeORMConnectionSettingsFactory.createDatasourceTypeORMConnectionSettings(
            "postgres",
            parseInt(process.env.DB_PORT || "5432", 10),
            process.env.POSTGRES_USER || "postgres",
            process.env.POSTGRES_PASSWORD || "postgres",
            process.env.POSTGRES_DB || "postgres",
            true,
            false,
            host,
            false,
            15, // number of connections in the pool
        );
    // Promise of the TypeORM DataSource object
    // This object is needed for the repositories to be able to ask queries.
    protected static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(
        this.datasourceConnectionSettings,
    );

    public static getDataSource(): Promise<DataSource> {
        return this.datasourcePromise;
    }
}
