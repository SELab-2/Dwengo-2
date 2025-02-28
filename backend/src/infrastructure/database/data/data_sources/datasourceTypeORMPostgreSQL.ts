import { DataSource } from "typeorm";
import { Teacher } from "../../../../core/entities/teacher";
import { UserTypeORM } from "../data_models/userTypeorm";
import { TeacherTypeORM } from "../data_models/teacherTypeorm";
import { DatasourceTypeORMPostgreSQLSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";

export class DatasourceTypeORMPostgreSQL {

    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings = 
        DatasourceTypeORMConnectionSettingsFactory
        .createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database"
        );
    
    private static datasourcePromise: Promise<DataSource> = DatasourceTypeORMPostgreSQLSingleton.getInstance(this.datasourceConnectionSettings);

    public static async createTeacher(teacher: Teacher): Promise<Teacher> {

        const datasource: DataSource = await this.datasourcePromise;

        console.log(teacher);

        console.log("Datasource: create teacher: user");
        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        console.log("Datasource: create teacher: teacher");
        const teacherModel: TeacherTypeORM = await datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

}
