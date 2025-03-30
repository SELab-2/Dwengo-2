import { EntityNotFoundError } from "../../config/error";
import { Student } from "../../core/entities/student";
import { IStudentRepository } from "../../core/repositories/studentRepositoryInterface";
import { DatasourceStudentTypeORM } from "../database/data/data_sources/typeorm/datasourceStudentTypeORM";

export class StudentRepositoryTypeORM extends IStudentRepository {
    private datasourceStudent: DatasourceStudentTypeORM;

    public constructor() {
        super();
        this.datasourceStudent = new DatasourceStudentTypeORM();
    }

    public async create(student: Student): Promise<Student> {
        return await this.datasourceStudent.createStudent(student);
    }

    public async getById(id: string): Promise<Student> {
        const student: Student | null = await this.datasourceStudent.getStudentById(id);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with id: ${id} not found`);
        }
    }

    public async getByEmail(email: string): Promise<Student> {
        const student: Student | null = await this.datasourceStudent.getStudentByEmail(email);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with email: ${email} not found`);
        }
    }

    public async getByFirstName(first_name: string): Promise<Student> {
        const student: Student | null = await this.datasourceStudent.getStudentByFirstName(first_name);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with first name: ${first_name} not found`);
        }
    }

    public async getByLastName(last_name: string): Promise<Student> {
        const student: Student | null = await this.datasourceStudent.getStudentByLastName(last_name);

        if (student) {
            return student;
        } else {
            throw new EntityNotFoundError(`Student with last name: ${last_name} not found`);
        }
    }

    public async getAll(): Promise<Student[]> {
        return await this.datasourceStudent.getAllStudents();
    }

    public async update(student: Student): Promise<Student> {
        return await this.datasourceStudent.updateStudent(student);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceStudent.deleteStudentWithId(id);
    }

    public async removeFromClass(studentId: string, classId: string): Promise<void> {
        await this.datasourceStudent.removeStudentFromClass(studentId, classId);
    }

    public async removeFromGroup(studentId: string, groupId: string): Promise<void> {
        await this.datasourceStudent.removeStudentFromGroup(studentId, groupId);
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
        await this.datasourceStudent.assignStudentToGroup(studentId, groupId);
    }

    public async getByClassId(classId: string): Promise<Student[]> {
        return await this.datasourceStudent.getClassStudents(classId);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Student[]> {
        return await this.datasourceStudent.getAssignmentStudents(assignmentId);
    }

    public async getByGroupId(groupId: string): Promise<Student[]> {
        return await this.datasourceStudent.getGroupStudents(groupId);
    }
}
