import { Student } from "../../core/entities/student";
import { IStudentRepository } from "../../core/repositories/studentRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceStudent } from "../database/data/data_sources/datasourceStudentInterface";

export class StudentRepositoryTypeORM extends IStudentRepository {

    private datasource: IDatasource;
    private datasourceStudent: Promise<IDatasourceStudent>

    public constructor(
        datasourceFactory: IDatasourceFactory
    ) {
        super(datasourceFactory);
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceStudent = this.datasource.getDatasourceStudent();
    }

    async createStudent(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).createStudent(student);
    }

    async getStudentById(id: string): Promise<Student|null> {
        return await (await this.datasourceStudent).getStudentById(id);
    }

    async getStudentByEmail(email: string): Promise<Student|null> {
        return await (await this.datasourceStudent).getStudentByEmail(email);
    }

    async getStudentByFirstName(first_name: string): Promise<Student|null> {
        return await (await this.datasourceStudent).getStudentByFirstName(first_name);
    }

    async getStudentByLastName(last_name: string): Promise<Student|null> {
        return await (await this.datasourceStudent).getStudentByLastName(last_name);
    }

    async getAllStudents(): Promise<Student[]> {
        return await (await this.datasourceStudent).getAllStudents();
    }

    async updateStudent(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).updateStudent(student);
    }

    async deleteStudentWithId(id: string): Promise<void> {
        return await (await this.datasourceStudent).deleteStudentWithId(id);
    }
    
}
