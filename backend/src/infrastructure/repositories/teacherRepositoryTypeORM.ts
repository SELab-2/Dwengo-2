import { Teacher } from "../../core/entities/teacher";
import { ITeacherRepository } from "../../core/repositories/teacherRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceTeacher } from "../database/data/data_sources/datasourceTeacherInterface";

export class TeacherRepositoryTypeORM extends ITeacherRepository {

    private datasource: IDatasource;
    private datasourceTeacher: Promise<IDatasourceTeacher>

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceTeacher = this.datasource.getDatasourceTeacher();
    }

    async createTeacher(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).createTeacher(teacher);
    }

    async getTeacherById(id: string): Promise<Teacher|null> {
        return await (await this.datasourceTeacher).getTeacherById(id);
    }

    async getTeacherByEmail(email: string): Promise<Teacher|null> {
        return await (await this.datasourceTeacher).getTeacherByEmail(email);
    }

    async getTeacherByFirstName(first_name: string): Promise<Teacher|null> {
        return await (await this.datasourceTeacher).getTeacherByFirstName(first_name);
    }

    async getTeacherByLastName(last_name: string): Promise<Teacher|null> {
        return await (await this.datasourceTeacher).getTeacherByLastName(last_name);
    }

    async getAllTeachers(): Promise<Teacher[]> {
        return await (await this.datasourceTeacher).getAllTeachers();
    }

    async updateTeacher(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).updateTeacher(teacher);
    }

    async deleteTeacherWithId(id: string): Promise<void> {
        return await (await this.datasourceTeacher).deleteTeacherWithId(id);
    }
    
}
