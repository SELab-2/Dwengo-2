import { DataSource, TypeORMError } from "typeorm"
import { AssignmentForGroup } from "../data_models/assignmentForGroupTypeorm";
import { Assignment } from "../data_models/assignmentTypeorm";
import { Class } from "../data_models/classTypeorm";
import { Group } from "../data_models/groupTypeorm";
import { PendingInvite } from "../data_models/joinRequestTypeorm";
import { StudentOfClass } from "../data_models/studentOfClassTypeorm";
import { StudentOfGroup } from "../data_models/studentInGroupTypeorm";
import { QuestionThread } from "../data_models/questionThreadTypeorm";
import { Student } from "../data_models/studentTypeorm";
import { TeacherOfClass } from "../data_models/teacherOfClassTypeorm";
import { Teacher } from "../data_models/teacherTypeorm";
import { User } from "../data_models/userTypeorm";
import { ThreadMessage } from "../data_models/threadMessageTypeorm";
import { DatasourceInterface } from "./datasourceInterface";
import { Submission } from "../data_models/submissionTypeorm";

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
                AssignmentForGroup,
                QuestionThread,
                ThreadMessage,
                Submission
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
