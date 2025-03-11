import { EntityNotFoundError } from "../../config/error";
import { Student } from "../../core/entities/student";
import { StudentRepositoryInterface } from "../../core/repositories/studentRepositoryInterface";
import { IDatasourceFactory } from "../database/data/data_sources/datasourceFactoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceStudent } from "../database/data/data_sources/datasourceStudentInterface";

export class StudentRepositoryTypeORM extends StudentRepositoryInterface {

    private datasource: IDatasource;
    private datasourceStudent: Promise<IDatasourceStudent>

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceStudent = this.datasource.getDatasourceStudent();
    }

    async createStudent(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).createStudent(student);
    }

    async getStudentById(id: string): Promise<Student> {
        const student: Student|null = await (await this.datasourceStudent).getStudentById(id);

        if(student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with id: ${id} not found`);
        }
    }

    async getStudentByEmail(email: string): Promise<Student> {
        const student: Student|null = await (await this.datasourceStudent).getStudentByEmail(email);

        if(student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with email: ${email} not found`);
        }
    }

    async getStudentByFirstName(first_name: string): Promise<Student> {
        const student: Student|null = await (await this.datasourceStudent).getStudentByFirstName(first_name);

        if(student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with first name: ${first_name} not found`);
        }
    }

    async getStudentByLastName(last_name: string): Promise<Student> {
        const student: Student|null = await (await this.datasourceStudent).getStudentByLastName(last_name);

        if(student) {
            return student
        } else {
            throw new EntityNotFoundError(`Student with last name: ${last_name} not found`);
        }
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
