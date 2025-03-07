import { Class } from "../../core/entities/class";
import { IClassRepository } from "../../core/repositories/classRepositoryInterface";
import { IDatasourceClass } from "../database/data/data_sources/datasourceClassInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";

export class ClassRepositoryTypeORM extends IClassRepository {

    private datasource: IDatasource;
    private datasourceClass: Promise<IDatasourceClass>;

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceClass = this.datasource.getDatasourceClass();
    }

    public async createClass(newClass: Class): Promise<Class> {
        return await (await this.datasourceClass).createClass(newClass);
    }

    public async getClassById(id: string): Promise<Class | null> {
        return await (await this.datasourceClass).getClassById(id);
    }

    public async getClassByName(name: string): Promise<Class | null> {
        return await (await this.datasourceClass).getClassByName(name);
    }

    public async getAllClasses(): Promise<Class[]> {
        return await (await this.datasourceClass).getAllClasses();
    }

    public async deleteClassById(id: string): Promise<void> {
        return await (await this.datasourceClass).deleteClassById(id);
    }

}
