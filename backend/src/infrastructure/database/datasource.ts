import { DataSource, TypeORMError } from "typeorm"
import { AssignmentAnswer } from "./entities/assignment_answer";
import { AssignmentGroup } from "./entities/assignment_group";
import { Assignment } from "./entities/assignment";
import { Class } from "./entities/class";
import { Group } from "./entities/group";
import { Invites } from "./entities/invites";
import { StudentOfClass } from "./entities/student_of_class";
import { StudentOfGroup } from "./entities/student_of_group";
import { StudentProgress } from "./entities/student_progress";
import { StudentQuestion } from "./entities/student_question";
import { Student } from "./entities/student";
import { TeacherGroupAssignment } from "./entities/teacher_group_assignment";
import { TeacherOfClass } from "./entities/teacher_of_class";
import { Teacher } from "./entities/teacher";
import { User } from "./entities/user";

/**
 * A TypeORM DataSource holds all the database connection settings and establishes
 * a connection with the database.
 */
export const DwengoPostgreSQLDataSource = new DataSource({
    type: "postgres",           // PostgreSQL database
    host: "localhost",          // Hostname
    port: 5432,                 // Port
    username: "postgres",       // Username to login to the database
    password: "postgres",       // Password //TODO: properties file?
    database: "dwengo-database",// Database name
    synchronize: true,          // Sync the database schema
    logging: true,              // SQL logging
    entities: [
        AssignmentAnswer,
        AssignmentGroup,
        Assignment,
        Class,
        Group,
        Invites,
        StudentOfClass,
        StudentOfGroup,
        StudentProgress,
        StudentQuestion,
        Student,
        TeacherGroupAssignment,
        TeacherOfClass,
        Teacher,
        User
    ]
});

/**
 * Initialize the connection with the database.
 * It is meant that this gets called during the application bootstrap, // TODO
 * calling `DwengoPostgreSQLDataSource.destroy()` stops the connection,
 * in production this should not happen.
 */
export function initialize_postgres_datasource(): void {
    DwengoPostgreSQLDataSource.initialize()
    .then(async () => {
        console.log("Initialize succesfull!"); // TODO: remove console.log

        // TODO: add a test user
        const user: User = new User();
        user.email = "TESTMAIL";
        user.family_name = "JANSSENS";
        user.forename = "BRENT";
        user.name_school = "UGENT";
        user.password_hash = "123";
        const savedUser = await DwengoPostgreSQLDataSource.getRepository(User).save(user);

    })
    .catch((error: TypeORMError) => {
        console.error("Initialize unsuccesfull", error) // TODO: remove console.log
    });
}
