import { EntityNotFoundError } from "../../../../../config/error";
import { Class } from "../../../../../core/entities/class";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { IDatasourceClass } from "../datasourceClassInterface";

export class DatasourceClassTypeORM extends IDatasourceClass {
    public async createClass(newClass: Class): Promise<Class> {
        const classModel = await this.datasource
            .getRepository(ClassTypeORM)
            .save(ClassTypeORM.createClassTypeORM(newClass));

        return classModel.toClassEntity();
    }

    public async getClassById(id: string): Promise<Class | null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: id } });

        if (classModel !== null) {
            return classModel.toClassEntity();
        }
        return null; // No result
    }

    public async getClassByName(name: string): Promise<Class | null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { name: name } });

        if (classModel !== null) {
            return classModel.toClassEntity();
        }
        return null; // No result
    }

    public async getAllClasses(): Promise<Class[]> {
        const classModels: ClassTypeORM[] = await this.datasource.getRepository(ClassTypeORM).find();

        return classModels.map((classModel: ClassTypeORM) => classModel.toClassEntity());
    }

    public async deleteClassById(id: string): Promise<void> {
        await this.datasource.getRepository(ClassTypeORM).delete(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        const teacherClasses: TeacherOfClassTypeORM[] = await this.datasource
            .getRepository(TeacherOfClassTypeORM)
            .find({
                where: { teacher: { id: id } },
                relations: ["class"],
            });

        const studentClasses: StudentOfClassTypeORM[] = await this.datasource
            .getRepository(StudentOfClassTypeORM)
            .find({
                where: { student: { id: id } },
                relations: ["class"],
            });

        if (teacherClasses.length === 0 && studentClasses.length === 0) {
            throw new EntityNotFoundError(`No classes found for user with id: ${id}`);
        }

        if (teacherClasses.length > 0) {
            return teacherClasses.map(teacherOfClass => teacherOfClass.class.toClassEntity());
        } else {
            return studentClasses.map(studentOfClass => studentOfClass.class.toClassEntity());
        }
    }

    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        if (userType === JoinRequestType.TEACHER) {
            await this.datasource.getRepository(TeacherOfClassTypeORM).save({
                teacher: { id: userId },
                class: { id: classId },
            });
        } else {
            await this.datasource.getRepository(StudentOfClassTypeORM).save({
                student: { id: userId },
                class: { id: classId },
            });
        }
    }
}
