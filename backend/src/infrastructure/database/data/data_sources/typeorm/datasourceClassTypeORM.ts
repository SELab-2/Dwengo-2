import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Class } from "../../../../../core/entities/class";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";

export class DatasourceClassTypeORM extends DatasourceTypeORM {
    public async createClass(newClass: Class): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        let classModel: ClassTypeORM = await datasource.getRepository(ClassTypeORM).create({
            name: newClass.name,
            description: newClass.description,
            targetAudience: newClass.targetAudience,
        });

        classModel = await datasource.getRepository(ClassTypeORM).save(classModel);

        let teacherOfClassModel: TeacherOfClassTypeORM = await datasource.getRepository(TeacherOfClassTypeORM).create({
            teacher: { id: newClass.teacherId },
            class: { id: classModel.id },
        });

        teacherOfClassModel = await datasource.getRepository(TeacherOfClassTypeORM).save(teacherOfClassModel);

        return classModel.toClassEntity(teacherOfClassModel.id);
    }

    public async getClassById(id: string): Promise<Class | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: id } });

        if (classModel !== null) {
            const classTeacherModel: TeacherOfClassTypeORM | null = await datasource
                .getRepository(TeacherOfClassTypeORM)
                .findOne({ where: { class: { id: id } }, relations: ["teacher"] });

            return classModel.toClassEntity(classTeacherModel!.teacher.id);
        }
        return null; // No result
    }

    public async getClassByName(name: string): Promise<Class | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { name: name } });

        if (classModel !== null) {
            const classTeacherModel: TeacherOfClassTypeORM | null = await datasource
                .getRepository(TeacherOfClassTypeORM)
                .findOne({ where: { class: { id: classModel.id } } });

            return classModel.toClassEntity(classTeacherModel!.teacher.id);
        }
        return null; // No result
    }

    public async getAllClasses(): Promise<Class[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModels: ClassTypeORM[] = await datasource.getRepository(ClassTypeORM).find();

        return Promise.all(
            classModels.map(async (classModel: ClassTypeORM) => {
                const classTeacherModel: TeacherOfClassTypeORM | null = await datasource
                    .getRepository(TeacherOfClassTypeORM)
                    .findOne({ where: { class: { id: classModel.id } } });

                return classModel.toClassEntity(classTeacherModel!.teacher.id);
            }),
        );
    }

    public async deleteClassById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource.getRepository(ClassTypeORM).delete(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        // Check if the user actually exists
        const teacher: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: id },
            relations: ["teacher"],
        });
        const student: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: id },
            relations: ["student"],
        });

        if (!student && !teacher) {
            throw new EntityNotFoundError(`User with id ${id} does not exist`);
        }

        if (student) {
            // Get the student's classes
            const studentClasses: StudentOfClassTypeORM[] = await datasource.getRepository(StudentOfClassTypeORM).find({
                where: { student: { id: id } },
                relations: ["class", "student"],
            });
            return Promise.all(
                studentClasses.map(async studentOfClass => {
                    const teacherOfClass = await datasource.getRepository(TeacherOfClassTypeORM).findOne({
                        where: { class: { id: studentOfClass.class.id } },
                    });
                    return studentOfClass.class.toClassEntity(teacherOfClass!.id);
                }),
            );
        } else {
            // Get the teacher's classes
            const teacherClasses: TeacherOfClassTypeORM[] = await datasource.getRepository(TeacherOfClassTypeORM).find({
                where: { teacher: { id: id } },
                relations: ["class", "teacher"],
            });
            return Promise.all(
                teacherClasses.map(teacherOfClass => {
                    return teacherOfClass.class.toClassEntity(teacherOfClass.teacher.id);
                }),
            );
        }
    }

    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        if (userType === JoinRequestType.TEACHER) {
            await datasource.getRepository(TeacherOfClassTypeORM).save({
                teacher: { id: userId },
                class: { id: classId },
            });
        } else {
            await datasource.getRepository(StudentOfClassTypeORM).save({
                student: { id: userId },
                class: { id: classId },
            });
        }
    }
}
