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

export class DatasourceTypeORMConnectionSettingsFactory {

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
