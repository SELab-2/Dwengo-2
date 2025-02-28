import { Teacher } from "../../core/entities/teacher";
import { ITeacherRepository } from "../../core/repositories/teacherRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { DatasourceTypeORMPostgreSQL } from "../database/data/data_sources/datasourceTypeORMPostgreSQL";

export class TeacherRepositoryTypeORM extends ITeacherRepository {

    private datasource: DatasourceTypeORMPostgreSQL;

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
    }

    async createTeacher(teacher: Teacher): Promise<Teacher> {
        console.log("Teacher repo: create");
        return await this.datasource.createTeacher(teacher);
    }

    getTeacherById(id: string): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }

    getTeacherByEmail(email: string): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }

    getTeacherByFirstName(first_name: string): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }

    getTeacherByLastName(last_name: string): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }

    getAllTeachers(): Promise<Teacher[]> {
        throw new Error("Method not implemented.");
    }

    updateTeacher(teacher: Teacher): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }

    deleteTeacher(teacher: Teacher): Promise<Teacher> {
        throw new Error("Method not implemented.");
    }
}
