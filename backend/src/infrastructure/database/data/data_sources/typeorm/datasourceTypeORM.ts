import { DataSource } from "typeorm";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { IDatasource } from "../datasourceInterface";
import { IDatasourceTeacher } from "../datasourceTeacherInterface";
import { DatasourceTeacherTypeORM } from "./datasourceTeacherTypeORM";

export class DatasourceTypeORM implements IDatasource {

    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings = 
        DatasourceTypeORMConnectionSettingsFactory
        .createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432, // 5433 for development docker, 5432 for production docker (on server)
            "postgres",
            "postgres",
            "dwengo-database",
            true,
            true
        );
    
    private static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(this.datasourceConnectionSettings);


    public async getDatasourceTeacher(): Promise<IDatasourceTeacher> {
        return new DatasourceTeacherTypeORM(await DatasourceTypeORM.datasourcePromise);
    }
    
}
