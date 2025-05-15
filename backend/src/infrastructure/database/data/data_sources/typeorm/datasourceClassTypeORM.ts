import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError, ExpiredError } from "../../../../../config/error";
import { Class } from "../../../../../core/entities/class";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceClassTypeORM extends DatasourceTypeORM {
    public async createClass(newClass: Class): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const teacherModel: UserTypeORM | null = await datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { id: newClass.teacherId, role: UserType.TEACHER } });

        if (!teacherModel) {
            throw new EntityNotFoundError(`Teacher with id ${newClass.teacherId} not found`);
        }

        let classModel: ClassTypeORM = await datasource.getRepository(ClassTypeORM).create({
            name: newClass.name,
            description: newClass.description,
            targetAudience: newClass.targetAudience,
            members: [teacherModel], // Adds the teacher to the class
        });

        classModel = await datasource.getRepository(ClassTypeORM).save(classModel);

        return classModel.toClassEntity();
    }

    public async updateClass(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // find the class model with classId
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: classId }, relations: { members: true } });

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

    public async getClassById(id: string): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: id }, relations: { members: true } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${id} not found`);
        }

        const teacher: UserTypeORM | undefined = classModel.members.find(
            userModel => userModel.role == UserType.TEACHER,
        );

        if (!teacher) {
            throw new EntityNotFoundError(`No teacher found for class with id ${id}`);
        }

        return classModel.toClassEntity();
    }

    public async getClassByName(name: string): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: ClassTypeORM | null = await datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { name: name }, relations: { members: true } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with name ${name} not found`);
        }

        const teacher: UserTypeORM | undefined = classModel.members.find(
            userModel => userModel.role == UserType.TEACHER,
        );

        if (!teacher) {
            throw new EntityNotFoundError(`No teacher found for class with name ${name}`);
        }

        return classModel.toClassEntity();
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
            .findOne({ where: { code: code }, relations: ["class"] });

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

        const classModels: ClassTypeORM[] = await datasource
            .getRepository(ClassTypeORM)
            .find({ relations: { members: true } });

        return classModels.map(classModel => classModel.toClassEntity());
    }

    public async deleteClassById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource.getRepository(ClassTypeORM).delete(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        // Check if the user actually exists
        const user: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: id },
        });

        if (!user) {
            throw new EntityNotFoundError(`User with id ${id} not found`);
        }

        const classModels: ClassTypeORM[] = await datasource.getRepository(ClassTypeORM).find({
            where: {
                members: {
                    id: id,
                },
            },
            relations: {
                members: true,
            },
        });

        return classModels.map(classModel => classModel.toClassEntity());
    }

    /**
     * Adds a student or teacher with id userId to a class.
     * @param classId The identifier of the class to join.
     * @param userId The id of the user that will join the class.
     */
    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel = await datasource.getRepository(ClassTypeORM).findOne({
            where: { id: classId },
            relations: { members: true },
        });
        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${classId} not found.`);
        }

        const user = await datasource.getRepository(UserTypeORM).findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new EntityNotFoundError(`User with id ${userId} not found.`);
        }
        classModel.members.push(user);

        await datasource.getRepository(ClassTypeORM).save(classModel);
    }
}
