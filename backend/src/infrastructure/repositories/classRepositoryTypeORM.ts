import { EntityNotFoundError } from "../../config/error";
import { Class } from "../../core/entities/class";
import { JoinRequestType } from "../../core/entities/joinRequest";
import { IClassRepository } from "../../core/repositories/classRepositoryInterface";
import { DatasourceClassTypeORM } from "../database/data/data_sources/typeorm/datasourceClassTypeORM";

export class ClassRepositoryTypeORM extends IClassRepository {
    private datasourceClass: DatasourceClassTypeORM;

    public constructor() {
        super();
        this.datasourceClass = new DatasourceClassTypeORM();
    }

    public async createClass(newClass: Class): Promise<Class> {
        return await this.datasourceClass.createClass(newClass);
    }

    public async updateClass(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        throw new Error("Not implemented yet");
    }

    public async getClassById(id: string): Promise<Class> {
        const _class: Class | null = await this.datasourceClass.getClassById(id);

        if (_class) {
            return _class;
        } else {
            throw new EntityNotFoundError(`Class with id: ${id} not found`);
        }
    }

    public async getClassByName(name: string): Promise<Class> {
        const _class: Class | null = await this.datasourceClass.getClassByName(name);

        if (_class) {
            return _class;
        } else {
            throw new EntityNotFoundError(`Class with name: ${name} not found`);
        }
    }

    public async getAllClasses(): Promise<Class[]> {
        return await this.datasourceClass.getAllClasses();
    }

    public async deleteClassById(id: string): Promise<void> {
        return await this.datasourceClass.deleteClassById(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        return await this.datasourceClass.getUserClasses(id);
    }

    public async getAllClassesByTeacherId(teacherId: string): Promise<Class[]> {
        return await this.getUserClasses(teacherId);
    }

    public async getAllClassesByStudentId(studentId: string): Promise<Class[]> {
        return await this.getUserClasses(studentId);
    }

    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        await this.datasourceClass.addUserToClass(classId, userId, userType);
    }
}
