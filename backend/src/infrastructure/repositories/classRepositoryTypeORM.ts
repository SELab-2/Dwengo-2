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

    public async create(newClass: Class): Promise<Class> {
        return await this.datasourceClass.createClass(newClass);
    }

    public async update(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        return await this.datasourceClass.updateClass(classId, updatedClass);
    }

    public async getById(id: string): Promise<Class> {
        return await this.datasourceClass.getClassById(id);
    }

    public async getByCode(code: string): Promise<Class> {
        return await this.datasourceClass.getClassByActiveCode(code);
    }

    public async getByName(name: string): Promise<Class> {
        return await this.datasourceClass.getClassByName(name);
    }

    public async getAll(): Promise<Class[]> {
        return await this.datasourceClass.getAllClasses();
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceClass.deleteClassById(id);
    }

    public async getByUserId(id: string): Promise<Class[]> {
        return await this.datasourceClass.getUserClasses(id);
    }

    public async getByTeacherId(teacherId: string): Promise<Class[]> {
        return await this.getByUserId(teacherId);
    }

    public async getByStudentId(studentId: string): Promise<Class[]> {
        return await this.getByUserId(studentId);
    }

    public async addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void> {
        await this.datasourceClass.addUserToClass(classId, userId, userType);
    }
}
