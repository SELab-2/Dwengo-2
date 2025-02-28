import { DataSource } from "typeorm";
import { ITeacher } from "../../../../core/entities/teacherInterface";
import { AssignmentAnswer } from "../data_models/assignmentAnswerTypeorm";
import { AssignmentGroup } from "../data_models/assignmentGroupTypeorm";
import { Assignment } from "../data_models/assignmentTypeorm";
import { Class } from "../data_models/classTypeorm";
import { Group } from "../data_models/groupTypeorm";
import { PendingInvite } from "../data_models/inviteTypeorm";
import { StudentOfClass } from "../data_models/studentOfClassTypeorm";
import { StudentOfGroup } from "../data_models/studentOfGroupTypeorm";
import { StudentProgress } from "../data_models/studentProgressTypeorm";
import { QuestionThread } from "../data_models/questionThreadTypeorm";
import { Student } from "../data_models/studentTypeorm";
import { TeacherGroupAssignment } from "../data_models/teacherGroupAssignmentTypeorm";
import { TeacherOfClass } from "../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../data_models/teacherTypeorm";
import { UserTypeORM } from "../data_models/userTypeorm";
import { ThreadQuestions } from "../data_models/threadQuestionTypeorm";
import { Teacher } from "../../../../core/entities/teacher";

export class DatasourceTypeORMPostgreSQL {
    
    static datasource: DataSource;

    public constructor(){
        DatasourceTypeORMPostgreSQL.datasource = new DataSource({
            type: "postgres",           // PostgreSQL database
            host: "database",           // Hostname -- is the name of the service created in the compose.yaml file
            port: 5432,                 // Port
            username: "postgres",       // Username to login to the database
            password: "postgres",       // Password //TODO: use a '.env' file along with dotenv package
            database: "dwengo-database",// Database name
            synchronize: true,          // Sync the database schema
            logging: true,              // SQL logging
            entities: [
                UserTypeORM, 
                Student, 
                TeacherTypeORM,
                PendingInvite,
                Class,
                TeacherOfClass,
                StudentOfClass,
                Group,
                StudentOfGroup,
                Assignment,
                AssignmentGroup,
                TeacherGroupAssignment,
                QuestionThread,
                ThreadQuestions,
                AssignmentAnswer,
                StudentProgress
            ]
        });
    }

    public static async createTeacher(teacher: Teacher): Promise<Teacher> {
        const userModel: UserTypeORM = await DatasourceTypeORMPostgreSQL
            .datasource
            .getRepository(UserTypeORM)
            .save(new UserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await DatasourceTypeORMPostgreSQL
            .datasource
            .getRepository(TeacherTypeORM)
            .save(new TeacherTypeORM(userModel));

        return teacherModel.toTeacherEntity(userModel);
    }

}
