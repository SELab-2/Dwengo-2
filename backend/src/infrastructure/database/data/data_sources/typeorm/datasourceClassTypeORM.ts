import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError, ExpiredError } from "../../../../../config/error";
import { JoinRequestType } from "../../../../../core/entities/joinRequest";
import { ClassTypeORM as Class } from "../../data_models/classTypeorm";
import { JoinCodeTypeORM } from "../../data_models/joinCodeTypeorm";
import { UserOfClassTypeORM } from "../../data_models/userOfClassTypeorm";
import { UserType, UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceClassTypeORM extends DatasourceTypeORM {
    public async createClass(newClass: Class): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        let classModel: Class = await datasource.getRepository(Class).create(newClass);

        classModel = await datasource.getRepository(Class).save(classModel);

        return classModel;
    }

    public async updateClass(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        // find the class model with classId
        const classModel: Class | null = await datasource.getRepository(Class).findOne({ where: { id: classId } });

        // if not found, error
        if (!classModel) {
            throw new EntityNotFoundError("Class not found");
        }

        // update the database
        await datasource.getRepository(Class).update(classId, updatedClass);

        const _class: Class | null = await this.getClassById(classId);
        // The class is present definitely, because we fetched it earlier
        return _class!;
    }

    public async getClassById(id: string): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const classModel: Class | null = await datasource.getRepository(Class).findOne({ where: { id: id } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with id ${id} not found`);
        }

        return classModel;
    }

    public async getClassByName(name: string): Promise<Class> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel: Class | null = await datasource.getRepository(Class).findOne({ where: { name: name } });

        if (!classModel) {
            throw new EntityNotFoundError(`Class with name ${name} not found`);
        }

        return classModel;
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

        const classModel: Class = joinCodeModel.class;

        const _class: Class | null = await this.getClassById(classModel.id);

        // The class is definitely in the database, because the code for that class was found
        return _class!;
    }

    public async getAllClasses(): Promise<Class[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModels: Class[] = await datasource.getRepository(Class).find();
        return classModels;
    }

    public async deleteClassById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource.getRepository(Class).delete(id);
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

        const userClasses: UserOfClassTypeORM[] = await datasource.getRepository(UserOfClassTypeORM).find({
            where: { user: { id: id } },
            relations: ["class", "user"],
        });

        return Promise.all(
            userClasses.map(async studentOfClass => {
                return studentOfClass.class;
            }),
        );
    }

    /**
     * Adds a student or teacher with id userId to a class.
     * @param classId The identifier of the class to join.
     * @param userId The id of the user that will join the class.
     */
    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const classModel = await datasource.getRepository(Class).findOne({
            where: { id: classId },
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
        const userOfClass = new UserOfClassTypeORM();
        userOfClass.user = user;
        userOfClass.class = classModel;
        await datasource.getRepository(UserOfClassTypeORM).save(userOfClass);
    }
}
