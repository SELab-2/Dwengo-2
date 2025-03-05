import { Class } from "../../core/entities/class";
import { IClassRepository } from "../../core/repositories/classRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";

export class ClassRepositoryTypeORM extends IClassRepository {

    private datasource: IDatasource;

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
    }

	public async createClass(newClass: Class): Promise<Class> {
        return await this.datasource.createClass(newClass);
	}

	public async getClassById(id: string): Promise<Class|null> {
        return await this.datasource.getClassById(id);
	}

    public async getClassByName(name: string): Promise<Class|null> {
        return await this.datasource.getClassByName(name);
	}

	public async getAllClasses(): Promise<Class[]> {
        return await this.datasource.getAllClasses();
	}

	public async deleteClassById(id: string): Promise<void> {
        return await this.datasource.deleteClassById(id);
	}
}
