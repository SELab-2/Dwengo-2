import { Class } from "../../../../../core/entities/class";
import { ClassTypeORM } from "../../data_models/classTypeorm";
import { IDatasourceClass } from "../datasourceClassInterface";

export class DatasourceClassTypeORM extends IDatasourceClass {

    public async createClass(newClass: Class): Promise<Class> {
        const classModel = await this.datasource
            .getRepository(ClassTypeORM)
            .save(ClassTypeORM.createClassTypeORM(newClass));

        return classModel.toClassEntity();
    }

    public async getClassById(id: string): Promise<Class|null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { id: id } });

        if (classModel !== null) {
            return classModel.toClassEntity();
        }
        return null; // No result
    }

    public async getClassByName(name: string): Promise<Class|null> {
        const classModel: ClassTypeORM | null = await this.datasource
            .getRepository(ClassTypeORM)
            .findOne({ where: { name: name } });

        if (classModel !== null) {
            return classModel.toClassEntity();
        }
        return null; // No result
    }

    public async getAllClasses(): Promise<Class[]> { 
        const classModels: ClassTypeORM[] = await this.datasource
            .getRepository(ClassTypeORM)
            .find();

        return classModels.map((classModel: ClassTypeORM) => classModel.toClassEntity());
    }

    public async deleteClassById(id: string): Promise<void> { 
        await this.datasource.getRepository(ClassTypeORM).delete(id);
    }    

}
