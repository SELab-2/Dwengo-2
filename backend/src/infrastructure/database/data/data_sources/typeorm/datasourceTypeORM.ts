import { DataSource } from "typeorm";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { IDatasource } from "../datasourceInterface";
import { IDatasourceTeacher } from "../datasourceTeacherInterface";
import { DatasourceTeacherTypeORM } from "./datasourceTeacherTypeORM";
import { IDatasourceClass } from "../datasourceClassInterface";
import { DatasourceClassTypeORM } from "./datasourceClassTypeORM";
import { DatasourceJoinRequestTypeORM } from "./datasourceJoinRequestTypeORM";
import { IDatasourceJoinRequest } from "../datasourceJoinRequestInterface";
import { IDatasourceGroup } from "../datasourceGroupInterface";
import { DatasourceGroupTypeORM } from "./datasourceGroupTypeORM";
import { IDatasourceAssignment } from "../datasourceAssignmentInterface";
import { DatasourceAssignmentTypeORM } from "./datasourceAssignmentTypeORM";

export class DatasourceTypeORM implements IDatasource {

    // Connection for the TypeORM - postgres database
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

    // Promise of the TypeORM DataSource object
    // This object is needed for the repositories to be able to ask queries.
    private static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(this.datasourceConnectionSettings);


    public async getDatasourceTeacher(): Promise<IDatasourceTeacher> {
        return new DatasourceTeacherTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceClass(): Promise<IDatasourceClass> {
        return new DatasourceClassTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceGroup(): Promise<IDatasourceGroup> {
        return new DatasourceGroupTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceJoinRequest(): Promise<IDatasourceJoinRequest> {
        return new DatasourceJoinRequestTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceAssignment(): Promise<IDatasourceAssignment> {
        return new DatasourceAssignmentTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

}
