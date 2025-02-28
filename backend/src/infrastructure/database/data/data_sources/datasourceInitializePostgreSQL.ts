import { DataSource, TypeORMError } from "typeorm"
import { IDatasourceInitialize } from "./datasourceInitializeInterface";
import { DatasourceTypeORMPostgreSQLSingleton } from "./datasourceTypeORMSingleton";

export class DatasourceInitializePostgreSQL implements IDatasourceInitialize {

    /**
     * A TypeORM DataSource holds all the database connection settings and establishes
     * a connection with the database.
     */
    private datasourcePromise: Promise<DataSource> = DatasourceTypeORMPostgreSQLSingleton.getInstance(); 

    async initialize_database(): Promise<void> {
        console.log("Initializing Dwengo's PostgreSQL database through TypeORM");

        const datasource: DataSource = await this.datasourcePromise;

        await datasource.initialize()
        .then(async () => {
            console.log("Initialization successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Initialization unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });
    }

    async shutdown_database(): Promise<void> {
        console.log("Shutting down Dwengo's PostgreSQL database through TypeORM");

        const datasource: DataSource = await this.datasourcePromise;

        datasource.destroy()
        .then(async () => {
            console.log("Shutdown of PostgreSQL database successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Shutdown of PostgreSQL database unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });
    }

}
