import { EntityNotFoundError } from "../../config/error";
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

    async getTeacherById(id: string): Promise<Teacher> {
        const teacher: Teacher|null = await (await this.datasourceTeacher).getTeacherById(id);

        if(teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with id: ${id} not found`);
        }
    }

    async getTeacherByEmail(email: string): Promise<Teacher> {
        const teacher: Teacher|null = await (await this.datasourceTeacher).getTeacherByEmail(email);

        if(teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with email: ${email} not found`);
        }
    }

    async getTeacherByFirstName(first_name: string): Promise<Teacher> {
        const teacher: Teacher|null = await (await this.datasourceTeacher).getTeacherByFirstName(first_name);

        if(teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with first name: ${first_name} not found`);
        }
    }

    async getTeacherByLastName(last_name: string): Promise<Teacher> {
        const teacher: Teacher|null = await (await this.datasourceTeacher).getTeacherByLastName(last_name);

        if(teacher) {
            return teacher
        } else {
            throw new EntityNotFoundError(`Teacher with last name: ${last_name} not found`);
        }
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
