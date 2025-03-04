import { DataSource, UpdateResult } from "typeorm";
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
            5433, // 5433 for development docker, 5432 for production docker (on server)
            "postgres",
            "postgres",
            "dwengo-database",
            true,
            true
        );
    
    private static datasourcePromise: Promise<DataSource> = DatasourceTypeORMSingleton.getInstance(this.datasourceConnectionSettings);

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

    public async getTeacherById(id: string): Promise<Teacher|null> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource
            .getRepository(TeacherTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["teacher"]
            });

        if (teacherModel !== null) {
            const t: Teacher = teacherModel.toTeacherEntity(teacherModel.teacher);
            console.log(t);
            return t;
        }
        return null; // No result
    }

    public async getTeacherByEmail(email: string): Promise<Teacher|null> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM|null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM|null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher|null> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM|null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM|null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher | null> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { family_name: last_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM | null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const teacherModels: TeacherTypeORM[] = await datasource
            .getRepository(TeacherTypeORM)
            .find({ relations: ["teacher"] });

        return teacherModels.map((teacherModel: TeacherTypeORM) => teacherModel.toTeacherEntity(teacherModel.teacher));
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        await datasource.getRepository(UserTypeORM).update(teacher.id!, UserTypeORM.createUserTypeORM(teacher));
        
        // For now, there is no need to update the Teacher table

        return teacher;
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        const datasource: DataSource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource
            .getRepository(TeacherTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["teacher"]
            });

        // TODO: check if teacherModel!.teacher.id! is not null

        if(teacherModel && teacherModel.teacher.id) {
            await datasource.getRepository(UserTypeORM).delete(teacherModel!.teacher.id!);
            await datasource.getRepository(TeacherTypeORM).delete(id);
        }
    }

}
