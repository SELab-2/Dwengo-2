import { DataSource } from "typeorm";
import { Teacher } from "../../../../core/entities/teacher";
import { UserTypeORM } from "../data_models/userTypeorm";
import { TeacherTypeORM } from "../data_models/teacherTypeorm";

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
                "../data_models/*.ts",
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
