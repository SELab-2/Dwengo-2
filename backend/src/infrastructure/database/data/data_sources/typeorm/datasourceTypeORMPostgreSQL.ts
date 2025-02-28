import { DataSource } from "typeorm";
import { Teacher } from "../../../../../core/entities/teacher";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { DatasourceTypeORMPostgreSQLSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { IDatasource } from "../datasourceInterface";

export class DatasourceTypeORMPostgreSQL implements IDatasource {

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

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource: DataSource = await DatasourceTypeORMPostgreSQL.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

}
