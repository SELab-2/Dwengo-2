import { DataSource, TypeORMError } from "typeorm"

/**
 * A TypeORM DataSource holds all the database connection settings and establishes
 * a connection with the database.
 */
export const DwengoPostgreSQLDataSource = new DataSource({
    type: "postgres",           // PostgreSQL database
    host: "localhost",          // Hostname
    port: 5432,                 // Port
    username: "postgres",       // Username to login to the database
    password: "postgres",       // Password //TODO: properties file?
    database: "dwengo-database" // Database name
});

/**
 * Initialize the connection with the database.
 * It is meant that this gets called during the application bootstrap, // TODO
 * calling `DwengoPostgreSQLDataSource.destroy()` stops the connection,
 * in production this should not happen.
 */
function initialize_datasource(): void {
    DwengoPostgreSQLDataSource.initialize()
    .then(() => {
        console.log("Initialize succesfull!"); // TODO: remove console.log
    })
    .catch((error: TypeORMError) => {
        console.error("Initialize unsuccesfull", error) // TODO: remove console.log
    });
}

// TODO: REMOVE, IS ONLY FOR TESTING IMPLEMENTATION
initialize_datasource();
