import { DataSource, TypeORMError } from "typeorm"
import { IDatasourceInitialize } from "./datasourceInitializeInterface";
import { DatasourceTypeORMPostgreSQLSingleton } from "./datasourceTypeORMSingleton";
import { ITeacherRepository } from "../../../../core/repositories/teacherRepositoryInterface";
import { TeacherRepositoryTypeORM } from "../../../repositories/teacherRepositoryTypeORM";
import { Teacher } from "../../../../core/entities/teacher";

export class DatasourceInitializePostgreSQL implements IDatasourceInitialize {

    /**
     * A TypeORM DataSource holds all the database connection settings and establishes
     * a connection with the database.
     */
    private datasourcePromise: Promise<DataSource> = DatasourceTypeORMPostgreSQLSingleton.getInstance(); 

    async initialize_database(): Promise<void> {
        console.log("Initializing Dwengo's PostgreSQL database through TypeORM");

        const datasource: DataSource = await this.datasourcePromise;

        await datasource.initialize()
        .then(async () => {
            console.log("Initialization successful");
        })
        .catch((error: TypeORMError) => {
            console.log("Initialization unsuccessful");
            //console.error("Error message: ", error);
            throw error;
        });

        // TODO: remove and implement test with Jest
        console.log("Creating teacher");
        const repo: ITeacherRepository = new TeacherRepositoryTypeORM();

        const teacher: Teacher =  new Teacher(
            "email@mail.com",
            "test",
            "name",
            "12345"
        );

        console.log(teacher);

        await repo.createTeacher(teacher);
    }

    async shutdown_database(): Promise<void> {
        console.log("Shutting down Dwengo's PostgreSQL database through TypeORM");

        const datasource: DataSource = await this.datasourcePromise;

        datasource.destroy()
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
