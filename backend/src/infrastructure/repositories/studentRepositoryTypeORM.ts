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

    public async create(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).createStudent(student);
    }

    public async getById(id: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentById(id);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with id: ${id} not found`);
        }
    }

    public async getByEmail(email: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByEmail(email);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with email: ${email} not found`);
        }
    }

    public async getByFirstName(first_name: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByFirstName(first_name);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with first name: ${first_name} not found`);
        }
    }

    public async getByLastName(last_name: string): Promise<Student> {
        const student: Student | null = await (await this.datasourceStudent).getStudentByLastName(last_name);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with last name: ${last_name} not found`);
        }
    }

    public async getAll(): Promise<Student[]> {
        return await (await this.datasourceStudent).getAllStudents();
    }

    public async update(student: Student): Promise<Student> {
        return await (await this.datasourceStudent).updateStudent(student);
    }

    public async deleteById(id: string): Promise<void> {
        return await (await this.datasourceStudent).deleteStudentWithId(id);
    }

    public async removeFromClass(studentId: string, classId: string): Promise<void> {
        await (await this.datasourceStudent).removeStudentFromClass(studentId, classId);
    }

    public async removeFromGroup(studentId: string, groupId: string): Promise<void> {
        await (await this.datasourceStudent).removeStudentFromGroup(studentId, groupId);
    }

    async checkByEmail(email: string): Promise<boolean> {
        try {
            const student: Student = await this.getByEmail(email);
            return student !== null;
        } catch (EntityNotFoundError) {
            return false;
        }
    }

    public async assignToGroup(studentId: string, groupId: string): Promise<void> {
        await (await this.datasourceStudent).assignStudentToGroup(studentId, groupId);
    }

    public async getByClassId(classId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getClassStudents(classId);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getAssignmentStudents(assignmentId);
    }

    public async getByGroupId(groupId: string): Promise<Student[]> {
        return await (await this.datasourceStudent).getGroupStudents(groupId);
    }
}
