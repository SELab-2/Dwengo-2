import { EntityNotFoundError } from "../../../../../config/error";
import { Class } from "../../../../../core/entities/class";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { IDatasourceClass } from "../datasourceClassInterface";

export class DatasourceClassTypeORM extends IDatasourceClass {
    public async createClass(newClass: Class): Promise<Class> {
        let classModel: ClassTypeORM = await this.datasource.getRepository(ClassTypeORM).create({
            name: newClass.name,
            description: newClass.description,
            targetAudience: newClass.targetAudience,
        });

        classModel = await this.datasource.getRepository(ClassTypeORM).save(classModel);

        let teacherOfClassModel: TeacherOfClassTypeORM = await this.datasource
            .getRepository(TeacherOfClassTypeORM)
            .create({
                teacher: { id: newClass.teacherId },
                class: { id: classModel.id },
            });

        teacherOfClassModel = await this.datasource.getRepository(TeacherOfClassTypeORM).save(teacherOfClassModel);

        return classModel.toClassEntity(teacherOfClassModel.id);
    }

    public async getClassById(id: string): Promise<Class | null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: id } });

        if (classModel !== null) {
            const classTeacherModel: TeacherOfClassTypeORM | null = await this.datasource
                .getRepository(TeacherOfClassTypeORM)
                .findOne({ where: { class: { id: id } } });

            return classModel.toClassEntity(classTeacherModel!.teacher.id);
        }
        return null; // No result
    }

    public async getClassByName(name: string): Promise<Class | null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { name: name } });

        if (classModel !== null) {
            const classTeacherModel: TeacherOfClassTypeORM | null = await this.datasource
                .getRepository(TeacherOfClassTypeORM)
                .findOne({ where: { class: { id: classModel.id } } });

            return classModel.toClassEntity(classTeacherModel!.teacher.id);
        }
        return null; // No result
    }

    public async getAllClasses(): Promise<Class[]> {
        const classModels: ClassTypeORM[] = await this.datasource.getRepository(ClassTypeORM).find();

        return Promise.all(
            classModels.map(async (classModel: ClassTypeORM) => {
                const classTeacherModel: TeacherOfClassTypeORM | null = await this.datasource
                    .getRepository(TeacherOfClassTypeORM)
                    .findOne({ where: { class: { id: classModel.id } } });

                return classModel.toClassEntity(classTeacherModel!.teacher.id);
            }),
        );
    }

    public async deleteClassById(id: string): Promise<void> {
        await this.datasource.getRepository(ClassTypeORM).delete(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        const teacherClasses: TeacherOfClassTypeORM[] = await this.datasource
            .getRepository(TeacherOfClassTypeORM)
            .find({
                where: { teacher: { id: id } },
                relations: ["class", "teacher"],
            });

        const studentClasses: StudentOfClassTypeORM[] = await this.datasource
            .getRepository(StudentOfClassTypeORM)
            .find({
                where: { student: { id: id } },
                relations: ["class", "student"],
            });

        if (teacherClasses.length === 0 && studentClasses.length === 0) {
            throw new EntityNotFoundError(`No classes found for user with id: ${id}`);
        }

        if (teacherClasses.length > 0) {
            return Promise.all(
                teacherClasses.map(teacherOfClass => {
                    return teacherOfClass.class.toClassEntity(teacherOfClass.teacher.id);
                }),
            );
        } else {
            return Promise.all(
                studentClasses.map(async studentOfClass => {
                    const teacherOfClass = await this.datasource.getRepository(TeacherOfClassTypeORM).findOne({
                        where: { class: { id: studentOfClass.class.id } },
                    });
                    return studentOfClass.class.toClassEntity(teacherOfClass!.id);
                }),
            );
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
