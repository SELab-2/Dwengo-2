import { DataSource, TypeORMError } from "typeorm"
import { AssignmentAnswer } from "../data_models/assignment_answer";
import { AssignmentGroup } from "../data_models/assignment_group";
import { Assignment } from "../data_models/assignment";
import { Class } from "../data_models/class";
import { Group } from "../data_models/group";
import { PendingInvite } from "../data_models/invite";
import { StudentOfClass } from "../data_models/student_of_class";
import { StudentOfGroup } from "../data_models/student_of_group";
import { StudentProgress } from "../data_models/student_progress";
import { QuestionThread } from "../data_models/question_thread";
import { Student } from "../data_models/student";
import { TeacherGroupAssignment } from "../data_models/teacher_group_assignment";
import { TeacherOfClass } from "../data_models/teacher_of_class";
import { Teacher } from "../data_models/teacher";
import { User } from "../data_models/user";
import { ThreadQuestions } from "../data_models/thread_question";
import { DatasourceInterface } from "./datasource_interface";

export class DatasourcePostgreSQL implements DatasourceInterface {

    /**
     * A TypeORM DataSource holds all the database connection settings and establishes
     * a connection with the database.
     */
    dwengoPostgreSQLDataSource: DataSource;

    constructor() {
        this.dwengoPostgreSQLDataSource = new DataSource({
            type: "postgres",           // PostgreSQL database
            host: "database",           // Hostname -- is the name of the service created in the compose.yaml file
            port: 5432,                 // Port
            username: "postgres",       // Username to login to the database
            password: "postgres",       // Password //TODO: use a '.env' file along with dotenv package
            database: "dwengo-database",// Database name
            synchronize: true,          // Sync the database schema
            logging: true,              // SQL logging
            entities: [
                User, 
                Student, 
                Teacher,
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

    /**
     * Initialize the connection with the PostgreSQL database.
     * It is meant that this gets called during the application bootstrap,
     * calling `DwengoPostgreSQLDataSource.destroy()` stops the connection,
     * in production this should not happen.
     */
    initialize_datasource(): void {
        console.log("Initializing Dwengo's PostgreSQL database through TypeORM");

        this.dwengoPostgreSQLDataSource.initialize()
        .then(async () => {
            console.log("Initialization successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Initialization unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });
    }

    /**
     * Gracefully close the connection to the PostgreSQL database.
     * This should not happen in production.
     */
    shutdown_datasource(): void {
        console.log("Shutting down Dwengo's PostgreSQL database through TypeORM");

        this.dwengoPostgreSQLDataSource.destroy()
        .then(async () => {
            console.log("Shutdown of PostgreSQL database successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Shutdown of PostgreSQL database unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });
    }

}
