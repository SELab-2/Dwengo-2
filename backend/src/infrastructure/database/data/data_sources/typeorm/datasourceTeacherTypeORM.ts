import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Teacher } from "../../../../../core/entities/teacher";
import { ClassTypeORM } from "../../data_models/classTypeorm";
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

        const originalClassSize = classModel.members.length;

        classModel.members = classModel.members.filter(userModel => userModel.id != teacherId);

        if (originalClassSize == classModel.members.length) {
            throw new EntityNotFoundError("Teacher not part of class");
        }

        datasource.getRepository(ClassTypeORM).save(classModel);
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
            relations: { members: true },
        });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found`);
        }

        // Only return the teachers of the class.
        const studentModels: UserTypeORM[] = classModel.members.filter(userModel => userModel.role == UserType.TEACHER);
        return studentModels.map(studentModel => studentModel.toEntity());
    }
}
