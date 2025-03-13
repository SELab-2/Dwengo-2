import { EntityNotFoundError } from "../../config/error";
import { Student } from "../../core/entities/student";
import { IStudentRepository } from "../../core/repositories/studentRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceStudent } from "../database/data/data_sources/datasourceStudentInterface";

export class StudentRepositoryTypeORM extends IStudentRepository {
    private datasource: IDatasource;
    private datasourceStudent: Promise<IDatasourceStudent>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceStudent = this.datasource.getDatasourceStudent();
    }

    async createStudent(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).createStudent(student);
    }

    async getStudentById(id: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentById(id);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with id: ${id} not found`);
        }
    }

    async getStudentByEmail(email: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByEmail(email);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with email: ${email} not found`);
        }
    }

    async getStudentByFirstName(first_name: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByFirstName(first_name);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with first name: ${first_name} not found`);
        }
    }

    async getStudentByLastName(last_name: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByLastName(last_name);

        if (student) {
            return student;
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

    async deleteStudentById(id: string): Promise<void> {
        return await (await this.datasourceStudent).deleteStudentWithId(id);
    }

    async removeStudentFromClass(studentId: string, classId: string): Promise<void> {
        await (await this.datasourceStudent).removeStudentFromClass(studentId, classId);
    }

    async removeStudentFromGroup(studentId: string, groupId: string): Promise<void> {
        await (await this.datasourceStudent).removeStudentFromGroup(studentId, groupId);
    }

    async checkByEmail(email: string): Promise<boolean> {
        try {
            const student: Student = await this.getStudentByEmail(email);
            return student !== null;
        } catch(EntityNotFoundError) {
            return false;
        }
    }

    async assignStudentToGroup(studentId: string, groupId: string): Promise<void> {
        await (await this.datasourceStudent).assignStudentToGroup(studentId, groupId);
    }

    async getClassStudents(classId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getClassStudents(classId);
    }

    async getAssignmentStudents(assignmentId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getAssignmentStudents(assignmentId);
    }

    async getGroupStudents(groupId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getGroupStudents(groupId);
    }
}
