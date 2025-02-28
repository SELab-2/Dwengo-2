import { DataSource, TypeORMError } from "typeorm"
import { IDatasourceInitialize } from "./datasourceInitializeInterface";

export class DatasourceInitializePostgreSQL implements IDatasourceInitialize {

    /**
     * A TypeORM DataSource holds all the database connection settings and establishes
     * a connection with the database.
     */
    dwengoPostgreSQLDataSource: DataSource;

    constructor() {
        this.dwengoPostgreSQLDataSource = new DataSource({
            type: "postgres",           // PostgreSQL database
            host: "database",           // Hostname -- is the name of the service created in the compose.yaml file
            port: 5432,                 // Port
            username: "postgres",       // Username to login to the database
            password: "postgres",       // Password //TODO: use a '.env' file along with dotenv package
            database: "dwengo-database",// Database name
            synchronize: true,          // Sync the database schema
            logging: true,              // SQL logging
            entities: [
                "../data_models/*.ts",
            ]
        });
    }

    initialize_database(): void {
        console.log("Initializing Dwengo's PostgreSQL database through TypeORM");

        this.dwengoPostgreSQLDataSource.initialize()
        .then(async () => {
            console.log("Initialization successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Initialization unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });
    }

    shutdown_database(): void {
        console.log("Shutting down Dwengo's PostgreSQL database through TypeORM");

        this.dwengoPostgreSQLDataSource.destroy()
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
