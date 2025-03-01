import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";

/**
 * Singleton class used in DatasourceTypeORM, TypeORM only allows a single connection of "the same name".
 * It contains the actual DataSource given by the TypeORM library (different from our datasources).
 */
export class DatasourceTypeORMSingleton {

    // Actual TypeORM DataSource instance
    private static instance: DataSource;

    /**
     * Get the singleton instance of the DataSource, get's created if it doesn't exist.
     * Else it returns the existing instance.
     * @param connectionSettings The connection settings to use for the DataSource
     * @returns A promise of the DataSource instance
     */
    public static async getInstance(connectionSettings: DatasourceTypeORMConnectionSettings): Promise<DataSource> {
        if(!this.instance) {
            console.log(`Initializing database connection to ${connectionSettings.getDatabase()} (${connectionSettings.getType()}) on ${connectionSettings.getHost()}:${connectionSettings.getPort()}`);

            connectionSettings.setSynchronize(true); // Make sure we sync when we don't a connection yet
            this.instance = new DataSource(connectionSettings.toObject());
            this.instance = await this.instance.initialize(); // TODO: can fail, so do more checks

            console.log("Initialization succesful");
        }
        return this.instance;
    }

    /**
     * Checks if the singleton DataSource has been initialized.
     * @returns True if the DataSource has been initialized, false otherwise.
     */
    public static isInitialized(): boolean {
        if(this.instance === undefined) {
            return false;
        }
        return this.instance.isInitialized
    }
    
    /**
     * Gracefully shutdown the database connection.
     */
    public static async shutdownDatabase(): Promise<void> {
        if(this.instance !== undefined) {
            console.log("Shutting down database connection");
            this.instance.destroy();
        }
    }

}
