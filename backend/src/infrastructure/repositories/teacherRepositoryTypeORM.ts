import { Teacher } from "../../core/entities/teacher";
import { ITeacherRepository } from "../../core/repositories/teacherRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";

export class TeacherRepositoryTypeORM extends ITeacherRepository {

    private datasource: IDatasource;

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
    }

    async createTeacher(teacher: Teacher): Promise<Teacher> {
        return await this.datasource.createTeacher(teacher);
    }

    async getTeacherById(id: string): Promise<Teacher|null> {
        return await this.datasource.getTeacherById(id);
    }

    async getTeacherByEmail(email: string): Promise<Teacher|null> {
        return await this.datasource.getTeacherByEmail(email);
    }

    async getTeacherByFirstName(first_name: string): Promise<Teacher|null> {
        return await this.datasource.getTeacherByFirstName(first_name);
    }

    async getTeacherByLastName(last_name: string): Promise<Teacher|null> {
        return await this.datasource.getTeacherByLastName(last_name);
    }

    async getAllTeachers(): Promise<Teacher[]> {
        return await this.datasource.getAllTeachers();
    }

    async updateTeacher(teacher: Teacher): Promise<Teacher> {
        return await this.datasource.updateTeacher(teacher);
    }

    async deleteTeacherWithId(id: string): Promise<void> {
        return await this.datasource.deleteTeacherWithId(id);
    }
}
