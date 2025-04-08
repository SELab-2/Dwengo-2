import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Teacher } from "../../../../../core/entities/teacher";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceTeacherTypeORM extends DatasourceTypeORM {
    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.user);
    }

    public async getTeacherById(id: string): Promise<Teacher | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: id },
            relations: ["teacher"],
        });

        if (teacherModel !== null) {
            const t: Teacher = teacherModel.toTeacherEntity(teacherModel.user);
            console.log(t);
            return t;
        }
        return null; // No result
    }

    public async getTeacherByEmail(email: string): Promise<Teacher | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM | null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { user: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM | null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { user: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM | null = await datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { user: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModels: TeacherTypeORM[] = await datasource
            .getRepository(TeacherTypeORM)
            .find({ relations: ["teacher"] });

        return teacherModels.map((teacherModel: TeacherTypeORM) => teacherModel.toTeacherEntity(teacherModel.user));
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource.getRepository(UserTypeORM).update(teacher.id!, UserTypeORM.createUserTypeORM(teacher));

        // For now, there is no need to update the Teacher table

        return teacher;
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: id },
            relations: ["teacher"],
        });

        // TODO: check if teacherModel!.teacher.id! is not null

        if (teacherModel && teacherModel.user.id) {
            await datasource.getRepository(UserTypeORM).delete(teacherModel!.user.id!);
            await datasource.getRepository(TeacherTypeORM).delete(id);
        }
    }

    public async deleteTeacherFromClass(teacherId: string, classId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource
            .createQueryBuilder()
            .delete()
            .from(TeacherOfClassTypeORM)
            .where("teacher_id = :teacher AND class_id = :class", { teacher: teacherId, class: classId })
            .execute();
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherOfClassModels: TeacherOfClassTypeORM[] = await datasource
            .getRepository(TeacherOfClassTypeORM)
            .find({
                where: { class: { id: classId } },
                relations: ["teacher", "teacher.user"],
            });

        if (teacherOfClassModels.length === 0) {
            throw new EntityNotFoundError(`No teachers found for class with id: ${classId}`);
        }

        const teachers = await Promise.all(
            teacherOfClassModels.map(teacherOfClassModel => {
                return teacherOfClassModel.teacher.toTeacherEntity(teacherOfClassModel.teacher.user);
            }),
        );

        return teachers.filter((teacher): teacher is Teacher => teacher !== undefined);
    }
}
