import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";

export class DatasourceTypeORMPostgreSQLSingleton {

    private static instance: DataSource;

    public static async getInstance(connectionSettings: DatasourceTypeORMConnectionSettings): Promise<DataSource> {
        if(!this.instance) {
            this.instance = new DataSource(connectionSettings.toObject());
            return await this.instance.initialize(); // TODO: can fail, so do more checks
        }
        return this.instance;
    }

    public static isInitialized(): boolean {
        if(this.instance === undefined) {
            return false;
        }
        return this.instance.isInitialized
    }
    
    public static async shutdownDatabase(): Promise<void> {
        if(this.instance !== undefined) {
            this.instance.destroy();
        }
    }

}
