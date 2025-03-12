import { EntityNotFoundError } from "../../config/error";
import { Class } from "../../core/entities/class";
import { IClassRepository } from "../../core/repositories/classRepositoryInterface";
import { IDatasourceClass } from "../database/data/data_sources/datasourceClassInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";

export class ClassRepositoryTypeORM extends IClassRepository {

    private datasource: IDatasource;
    private datasourceClass: Promise<IDatasourceClass>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceClass = this.datasource.getDatasourceClass();
    }

    public async createClass(newClass: Class): Promise<Class> {
        return await (await this.datasourceClass).createClass(newClass);
    }

    public async updateClass(classId: string, updatedClass: Partial<Class>): Promise<Class> {
        throw new Error("Not implemented yet");
    }

    public async getClassById(id: string): Promise<Class> {
        const _class: Class|null = await (await this.datasourceClass).getClassById(id);

        if(_class) {
            return _class;
        } else {
            throw new EntityNotFoundError(`Class with id: ${id} not found`);
        }
    }

    public async getClassByName(name: string): Promise<Class> {
        const _class: Class|null = await (await this.datasourceClass).getClassByName(name);

        if(_class) {
            return _class;
        } else {
            throw new EntityNotFoundError(`Class with name: ${name} not found`);
        }
    }

    public async getAllClasses(): Promise<Class[]> {
        return await (await this.datasourceClass).getAllClasses();
    }

    public async deleteClassById(id: string): Promise<void> {
        return await (await this.datasourceClass).deleteClassById(id);
    }

    public async getUserClasses(id: string): Promise<Class[]> {
        throw new Error("Not implemented yet");
    }

    public async getAllClassesByTeacherId(teacherId: string): Promise<Class[]> {
        throw new Error("Not implemented yet");
    }

    public async getAllClassesByStudentId(studentId: string): Promise<Class[]> {
        throw new Error("Not implemented yet");
    }

}
