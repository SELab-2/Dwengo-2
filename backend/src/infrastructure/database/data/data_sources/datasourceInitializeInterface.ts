export interface IDatasourceInitialize {
    // Note: usage of `never`, see: https://stackoverflow.com/questions/49434751/how-to-declare-a-function-that-throws-an-error-in-typescript

    /**
     * Initialize the database.
     * It is meant that this gets called during application bootstrap,
     * calling `shutdown_datasource` stops the connection gracefully.
     * In production this should not happen.
     * 
     * Throws an error when the connection fails.
     */
    initialize_database: () => void | never;

    /**
     * Gracefully close the PostgreSQL database.
     * This should not happen in production.
     * 
     * Throws an error when the connection fails.
     */
    shutdown_database: () => void | never;
}
