import { UserTypeORM } from "../../data_models/userTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { PendingInviteTypeORM } from "../../data_models/inviteTypeorm";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { GroupTypeORM } from "../../data_models/groupTypeorm";
import { StudentOfGroupTypeORM } from "../../data_models/studentOfGroupTypeorm";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { AssignmentGroupTypeORM } from "../../data_models/assignmentGroupTypeorm";
import { TeacherGroupAssignmentTypeORM } from "../../data_models/teacherGroupAssignmentTypeorm";
import { QuestionThreadTypeORM } from "../../data_models/questionThreadTypeorm";
import { ThreadQuestionsTypeORM } from "../../data_models/threadQuestionTypeorm";
import { AssignmentAnswerTypeORM } from "../../data_models/assignmentAnswerTypeorm";
import { StudentProgressTypeORM } from "../../data_models/studentProgressTypeorm";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";

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
     * @param entities The entities of the database (our data models)
     * @returns A new DatasourceTypeORMConnectionSettings object with the given configurations
     */
    public static createDatasourceTypeORMConnectionSettings(
        type: string,
        port: number,
        username: string,
        password: string,
        database: string,
        synchronize: boolean=false,
        logging: boolean=true,
        host: string="database",
        dropschema: boolean=false, // Never set this to true in production
        entities: any[] = [
            UserTypeORM, 
            StudentTypeORM, 
            TeacherTypeORM,
            PendingInviteTypeORM,
            ClassTypeORM,
            TeacherOfClassTypeORM,
            StudentOfClassTypeORM,
            GroupTypeORM,
            StudentOfGroupTypeORM,
            AssignmentTypeORM,
            AssignmentGroupTypeORM,
            TeacherGroupAssignmentTypeORM,
            QuestionThreadTypeORM,
            ThreadQuestionsTypeORM,
            AssignmentAnswerTypeORM,
            StudentProgressTypeORM
        ],
    ) {
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
            entities
        );
    }

}
