import { DataSource } from "typeorm";
import { Teacher } from "../../../../../core/entities/teacher";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { DatasourceTypeORMSingleton } from "./datasourceTypeORMSingleton";
import { DatasourceTypeORMConnectionSettings } from "./datasourceTypeORMConnectionSettings";
import { DatasourceTypeORMConnectionSettingsFactory } from "./datasourceTypeORMConnectionSettingsFactory";
import { IDatasource } from "../datasourceInterface";

export class DatasourceTypeORM implements IDatasource {

    private static datasourceConnectionSettings: DatasourceTypeORMConnectionSettings = 
        DatasourceTypeORMConnectionSettingsFactory
        .createDatasourceTypeORMConnectionSettings(
            "postgres",
            5432,
            "postgres",
            "postgres",
            "dwengo-database",
            true,
            true
        );
    
    private static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(this.datasourceConnectionSettings); // TODO: static can be removed?

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

}
