import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";
import { JoinRequestTypeORM } from "../../data_models/joinRequestTypeorm";
import { MessageTypeORM } from "../../data_models/messageTypeorm";
import { QuestionThreadTypeORM } from "../../data_models/questionThreadTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

/**
 * Factory class for creating DatasourceTypeORMConnectionSettings objects.
 * These connection settings are used to make datasources.
 */
export class DatasourceTypeORMConnectionSettingsFactory {
    // TODO: check for valid type inputs? (we don't support mysql, ...)

    /**
     * Create a new DatasourceTypeORMConnectionSettings object.
     * @param type Type of database, e.g. "postgres"
     * @param port Port number of the database
     * @param username Username for the database
     * @param password Password for the database
     * @param database Database name
     * @param synchronize Synchronize the database scheme and it's entities, if the database is uninitialized this initializes the database
     * @param logging Enable logging (recommended)
     * @param host Hostname
     * @param dropschema Drop the schema after closing the connection (never set this to true in production)
     * @param poolSize Number of open connections in the connection pool
     * @param entities The entities of the database (our data models)
     * @returns A new DatasourceTypeORMConnectionSettings object with the given configurations
     */
    public static createDatasourceTypeORMConnectionSettings(
        type: string,
        port: number,
        username: string,
        password: string,
        database: string,
        synchronize: boolean = false,
        logging: boolean = false,
        host: string = "database",
        dropschema: boolean = false, // Never set this to true in production
        poolSize: number = 15,

        // Next any[] is not possible to replace with a more specific type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entities: any[] = [
            UserTypeORM,
            StudentTypeORM,
            TeacherTypeORM,
            JoinCodeTypeORM,
            JoinRequestTypeORM,
            ClassTypeORM,
            TeacherOfClassTypeORM,
            StudentOfClassTypeORM,
            GroupTypeORM,
            StudentOfGroupTypeORM,
            AssignmentTypeORM,
            QuestionThreadTypeORM,
            MessageTypeORM,
        ],
    ): DatasourceTypeORMConnectionSettings {
        return new DatasourceTypeORMConnectionSettings(
            type,
            host,
            port,
            username,
            password,
            database,
            synchronize,
            logging,
            dropschema,
            poolSize,
            entities,
        );
    }
}
