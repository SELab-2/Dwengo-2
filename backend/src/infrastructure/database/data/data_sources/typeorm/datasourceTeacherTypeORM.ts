import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Student } from "../../../../../core/entities/student";
import { Teacher } from "../../../../../core/entities/teacher";
import { User } from "../../../../../core/entities/user";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { UserOfClassTypeORM } from "../../data_models/userOfClassTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceTeacherTypeORM extends DatasourceTypeORM {
    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM = await datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        return userModel.toEntity() as Teacher;
    }

    public async getTeacherById(id: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const teacherModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id, role: UserType.TEACHER },
        });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${id} not found`);
        }
        return teacherModel.toEntity() as Teacher;
    }

    public async getTeacherByEmail(email: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email, role: UserType.TEACHER } });

        if (!userModel) {
            throw new EntityNotFoundError(`Teacher with email ${email} not found`);
        }
        return userModel.toEntity() as Teacher;
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name, role: UserType.TEACHER } });

        if (!userModel) {
            throw new EntityNotFoundError(`Teacher with first name ${first_name} not found`);
        }
        return userModel.toEntity() as Teacher;
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name, role: UserType.TEACHER } });

        if (!userModel) {
            throw new EntityNotFoundError(`Teacher with last name ${last_name} not found`);
        }
        return userModel.toEntity() as Teacher;
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModels: UserTypeORM[] = await datasource
            .getRepository(UserTypeORM)
            .find({ where: { role: UserType.TEACHER } });

        return teacherModels.map((teacherModel: UserTypeORM) => teacherModel.toEntity() as Teacher);
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: teacher.id, role: UserType.TEACHER },
        });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${teacher.id} not found`);
        }

        await datasource.getRepository(UserTypeORM).update(teacherModel.id!, UserTypeORM.createUserTypeORM(teacher));

        return teacher;
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id, role: UserType.TEACHER },
        });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${id} not found`);
        }

        await datasource.getRepository(UserTypeORM).delete(teacherModel.id);
    }

    public async removeTeacherFromClass(teacherId: string, classId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        const teacherModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: teacherId, role: UserType.TEACHER },
        });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${teacherId} not found`);
        }

        const teacherOfClass: UserOfClassTypeORM | null = await datasource.getRepository(UserOfClassTypeORM).findOne({
            where: { user: teacherModel, class: classModel },
            relations: ["class"],
        });

        if (!teacherOfClass || teacherOfClass.class.id !== classId) {
            throw new EntityNotFoundError("Teacher not part of class");
        }

        await datasource.getRepository(UserOfClassTypeORM).delete(teacherOfClass);
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classJoinResult: UserOfClassTypeORM[] = await datasource
            .getRepository(UserOfClassTypeORM)
            .createQueryBuilder("userOfClass")
            .leftJoinAndSelect("userOfClass.user", "usr")
            .where("userOfClass.class.id = :classId", { classId: classId })
            .getMany();

        // Map the users to entities
        const users: User[] = classJoinResult.map(classJoinResult => {
            if (classJoinResult.user.role == UserType.TEACHER) {
                return classJoinResult.user.toEntity() as Teacher;
            } else {
                return classJoinResult.user.toEntity() as Student;
            }
        });

        // filter out all students in the result
        const teachers = users.filter(user => {
            return user instanceof Teacher;
        });

        return teachers;
    }
}
