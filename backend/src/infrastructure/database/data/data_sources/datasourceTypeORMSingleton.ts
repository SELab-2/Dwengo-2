import { DataSource } from "typeorm";
import { UserTypeORM } from "../data_models/userTypeorm";
import { TeacherTypeORM } from "../data_models/teacherTypeorm";
import { StudentTypeORM } from "../data_models/studentTypeorm";
import { PendingInviteTypeORM } from "../data_models/inviteTypeorm";
import { ClassTypeORM } from "../data_models/classTypeorm";
import { TeacherOfClassTypeORM } from "../data_models/teacherOfClassTypeorm";
import { StudentOfClassTypeORM } from "../data_models/studentOfClassTypeorm";
import { GroupTypeORM } from "../data_models/groupTypeorm";
import { StudentOfGroupTypeORM } from "../data_models/studentOfGroupTypeorm";
import { AssignmentTypeORM } from "../data_models/assignmentTypeorm";
import { AssignmentGroupTypeORM } from "../data_models/assignmentGroupTypeorm";
import { TeacherGroupAssignmentTypeORM } from "../data_models/teacherGroupAssignmentTypeorm";
import { QuestionThreadTypeORM } from "../data_models/questionThreadTypeorm";
import { ThreadQuestionsTypeORM } from "../data_models/threadQuestionTypeorm";
import { AssignmentAnswerTypeORM } from "../data_models/assignmentAnswerTypeorm";
import { StudentProgressTypeORM } from "../data_models/studentProgressTypeorm";

export class DatasourceTypeORMPostgreSQLSingleton {

    private static instance: DataSource;

    public static async getInstance(initDatabase: boolean=false): Promise<DataSource> {
        if(!this.instance) {
            this.instance = new DataSource({
                type: "postgres",           // PostgreSQL database
                host: "database",           // Hostname -- is the name of the service created in the compose.yaml file
                port: 5432,                 // Port
                username: "postgres",       // Username to login to the database
                password: "postgres",       // Password //TODO: use a '.env' file along with dotenv package
                database: "dwengo-database",// Database name
                synchronize: initDatabase,          // Sync the database schema
                logging: true,              // SQL logging
                entities: [
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
                ]
            });
            return await this.instance.initialize(); // TODO: can fail, so do more checks
        }
        return this.instance;
    }
    
}
