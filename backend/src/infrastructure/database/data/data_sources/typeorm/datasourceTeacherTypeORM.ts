import { DatasourceTypeORM } from "./datasourceTypeORM";
import { Teacher } from "../../../../../core/entities/teacher";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { EntityNotFoundError } from "../../../../../config/error";

export class DatasourceTeacherTypeORM extends DatasourceTypeORM {
    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

    public async getTeacherById(id: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: id },
            relations: ["teacher"],
        });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${id} not found`);
        }
        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

    public async getTeacherByEmail(email: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with email ${email} not found`);
        }
        const teacherModel: TeacherTypeORM | null = await datasource
            .getRepository(TeacherTypeORM)
            .findOne({ where: { teacher: userModel } });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with email ${email} not found`);
        }
        return teacherModel.toTeacherEntity(userModel);
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with first name ${first_name} not found`);
        }
        const teacherModel: TeacherTypeORM | null = await datasource
            .getRepository(TeacherTypeORM)
            .findOne({ where: { teacher: userModel } });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with first name ${first_name} not found`);
        }
        return teacherModel.toTeacherEntity(userModel);
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with last name ${last_name} not found`);
        }
        const teacherModel: TeacherTypeORM | null = await datasource
            .getRepository(TeacherTypeORM)
            .findOne({ where: { teacher: userModel } });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with last name ${last_name} not found`);
        }
        return teacherModel.toTeacherEntity(userModel);
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModels: TeacherTypeORM[] = await datasource
            .getRepository(TeacherTypeORM)
            .find({ relations: ["teacher"] });

        return teacherModels.map((teacherModel: TeacherTypeORM) => teacherModel.toTeacherEntity(teacherModel.teacher));
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

        if (teacherModel && teacherModel.teacher.id) {
            await datasource.getRepository(UserTypeORM).delete(teacherModel!.teacher.id!);
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

        const classJoinResults: TeacherOfClassTypeORM[] = await datasource
            .getRepository(TeacherOfClassTypeORM)
            .createQueryBuilder("teacherOfClass")
            .leftJoinAndSelect("teacherOfClass.teacher", "teacher")
            .leftJoinAndSelect("teacher.teacher", "user")
            .where("teacherOfClass.class.id = :classId", { classId: classId })
            .getMany();

        return classJoinResults.map(classJoinResult => {
            return classJoinResult.teacher.toTeacherEntity(classJoinResult.teacher.teacher);
        });
    }
}
