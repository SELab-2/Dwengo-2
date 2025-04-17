import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError, ExpiredError } from "../../../../../config/error";
import { Class } from "../../../../../core/entities/class";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";
import { StudentOfClassTypeORM } from "../../data_models/studentOfClassTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceClassTypeORM extends DatasourceTypeORM {
    public async createClass(newClass: Class): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        let classModel: ClassTypeORM = await datasource.getRepository(ClassTypeORM).create({
            name: newClass.name,
            description: newClass.description,
            targetAudience: newClass.targetAudience,
        });

        classModel = await datasource.getRepository(ClassTypeORM).save(classModel);

        const teacherOfClass = new TeacherOfClassTypeORM();
        teacherOfClass.teacher = { id: newClass.teacherId } as TeacherTypeORM;
        teacherOfClass.class = { id: classModel.id } as ClassTypeORM;
        await datasource.getRepository(TeacherOfClassTypeORM).save(teacherOfClass);

        return classModel.toClassEntity(newClass.teacherId);
    }

    public async updateClass(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // find the class model with classId
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: classId } });

        // if not found, error
        if (!classModel) {
            throw new EntityNotFoundError("Class not found");
        }

        // Get the partial updated class model
        const partialUpdatedClassModel: Partial<ClassTypeORM> = classModel.fromPartialClassEntity(updatedClass);

        // update the database
        await datasource.getRepository(ClassTypeORM).update(classId, partialUpdatedClassModel);

        const _class: Class | null = await this.getClassById(classId);
        // The class is present definitely, because we fetched it earlier
        return _class!;
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

    /**
     * Get the class that an active join code belongs to.
     * @param code The actual alphanumerical code.
     * @throws EntityNotFoundError when the code is not found.
     * @throws ExpiredError when the code is expired.
     * @returns A promise that resolves to the class for the given code.
     */
    public async getClassByActiveCode(code: string): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const joinCodeModel: JoinCodeTypeORM | null = await datasource
            .getRepository(JoinCodeTypeORM)
            .findOne({ where: { code: code } });

        if (!joinCodeModel) {
            throw new EntityNotFoundError(`Join code ${code} not found.`);
        }

        if (joinCodeModel.isExpired) {
            throw new ExpiredError(`The join code ${code} is expired.`);
        }

        const classModel: ClassTypeORM = joinCodeModel.class;

        const _class: Class | null = await this.getClassById(classModel.id);

        // The class is definitely in the database, because the code for that class was found
        return _class!;
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

    /**
     * Adds a user with user id to a class.
     * @param classId The identifier of the class to join.
     * @param userId The user id of the teacher or student that will join the class. (Not student or teacher id)
     * @param userType Teacher or student enum.
     */
    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        if (userType === JoinRequestType.TEACHER) {
            const teacherModel: TeacherTypeORM | null= await datasource.getRepository(TeacherTypeORM).findOne({
                where: { teacher: { id: userId } }
            })
            if (!teacherModel) {
                throw new EntityNotFoundError(`No user found with id ${userId} that has a teacher account`);
            }
            return await this.addTeacherToClass(classId, teacherModel.id);
        } else {
            const studentModel: StudentTypeORM | null= await datasource.getRepository(StudentTypeORM).findOne({
                where: { student: { id: userId } }
            })
            if (!studentModel) {
                throw new EntityNotFoundError(`No user found with id ${userId} that has a student account`);
            }
            return await this.addStudentToClass(classId, studentModel.id);
        }
    }

    /**
     * Adds a teacher with teacher id to a class.
     * @param classId The identifier of the class to join.
     * @param teacherId The id of the teacher (not user) that will join the class.
     */
    public async addTeacherToClass(classId: string, teacherId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacher = await datasource.getRepository(TeacherTypeORM).findOne({
            where: { id: teacherId },
        });
        if (!teacher) {
            throw new EntityNotFoundError(`Teacher with id ${teacherId} not found.`);
        }
        const teacherOfClass = new TeacherOfClassTypeORM();
        teacherOfClass.teacher = { id: teacher?.id } as TeacherTypeORM;
        teacherOfClass.class = { id: classId } as ClassTypeORM;
        await datasource.getRepository(TeacherOfClassTypeORM).save(teacherOfClass);
    }

    /**
     * Adds a student with student id to a class.
     * @param classId The identifier of the class to join.
     * @param teacherId The id of the student (not user) that will join the class.
     */
    public async addStudentToClass(classId: string, studentId: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const student = await datasource.getRepository(StudentTypeORM).findOne({
            where: { id: studentId! },
        });
        if (!student) {
            throw new EntityNotFoundError(`Student with id ${studentId} not found.`);
        }
        const studentOfClass = new StudentOfClassTypeORM();
        studentOfClass.student = { id: student?.id } as StudentTypeORM;
        studentOfClass.class = { id: classId } as ClassTypeORM;
        await datasource.getRepository(StudentOfClassTypeORM).save(studentOfClass);
    }
}
