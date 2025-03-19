import { DataSource } from "typeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { IDatasourceAssignment } from "../datasourceAssignmentInterface";
import { IDatasourceClass } from "../datasourceClassInterface";
import { IDatasourceGroup } from "../datasourceGroupInterface";
import { IDatasource } from "../datasourceInterface";
import { IDatasourceJoinRequest } from "../datasourceJoinRequestInterface";
import { IDatasourceMessage } from "../datasourceMessageInterface";
import { IDatasourceStudent } from "../datasourceStudentInterface";
import { IDatasourceSubmission } from "../datasourceSubmissionInterface";
import { IDatasourceTeacher } from "../datasourceTeacherInterface";
import { DatasourceAssignmentTypeORM } from "./datasourceAssignmentTypeORM";
import { DatasourceClassTypeORM } from "./datasourceClassTypeORM";
import { DatasourceGroupTypeORM } from "./datasourceGroupTypeORM";
import { DatasourceJoinRequestTypeORM } from "./datasourceJoinRequestTypeORM";
import { DatasourceStudentTypeORM } from "./datasourceStudentTypeORM";
import { DatasourceSubmissionTypeORM } from "./datasourceSubmissionTypeORM";
import { DatasourceTeacherTypeORM } from "./datasourceTeacherTypeORM";
import { IDatasourceThread } from "../datasourceThreadInterface";
import { DatasourceMessageTypeORM } from "./datasourceMessageTypeORM";
import { DatasourceThreadTypeORM } from "./datasourceThreadTypeORM";

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
    protected static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(
        this.datasourceConnectionSettings,
    );

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

    public async getDatasourceSubmission(): Promise<IDatasourceSubmission> {
        return new DatasourceSubmissionTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceMessage(): Promise<IDatasourceMessage> {
        return new DatasourceMessageTypeORM(await DatasourceTypeORM.datasourcePromise);
    }

    public async getDatasourceThread(): Promise<IDatasourceThread> {
        return new DatasourceThreadTypeORM(await DatasourceTypeORM.datasourcePromise);
    }
}
