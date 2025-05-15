import { Student } from "../../core/entities/student";
import { Teacher } from "../../core/entities/teacher";
import { User } from "../../core/entities/user";
import { IUserRepository } from "../../core/repositories/userRepositoryInterface";
import { DatasourceUserTypeORM } from "../database/data/data_sources/typeorm/datasourceUserTypeORM";

export class UserRepositoryTypeORM extends IUserRepository {
    private datasourceUser: DatasourceUserTypeORM;

    public constructor() {
        super();
        this.datasourceUser = new DatasourceUserTypeORM();
    }

    public async create(user: User): Promise<User> {
        return await this.datasourceUser.createUser(user);
    }

    public async getById(id: string): Promise<User> {
        return await this.datasourceUser.getUserById(id);
    }

    public async getByEmail(email: string): Promise<User> {
        return await this.datasourceUser.getUserByEmail(email);
    }

    public async getByFirstName(first_name: string): Promise<User> {
        return await this.datasourceUser.getUserByFirstName(first_name);
    }

    public async getByLastName(last_name: string): Promise<User> {
        return await this.datasourceUser.getUserByLastName(last_name);
    }

    public async update(user: User): Promise<User> {
        return await this.datasourceUser.updateUser(user);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceUser.deleteUserWithId(id);
    }

    public async removeFromClass(userId: string, classId: string): Promise<void> {
        await this.datasourceUser.removeUserFromClass(userId, classId);
    }

    public async removeFromGroup(studentId: string, groupId: string): Promise<void> {
        await this.datasourceUser.removeStudentFromGroup(studentId, groupId);
    }

    async checkByEmail(email: string): Promise<boolean> {
        try {
            const user: Student = await this.getByEmail(email);
            return user !== null;
        } catch (EntityNotFoundError) {
            return false;
        }
    }

    public async assignToGroup(studentId: string, groupId: string): Promise<void> {
        await this.datasourceUser.assignStudentToGroup(studentId, groupId);
    }

    public async getByClassId(classId: string): Promise<Student[]> {
        return await this.datasourceUser.getClassStudents(classId);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Student[]> {
        return await this.datasourceUser.getAssignmentStudents(assignmentId);
    }

    public async getByGroupId(groupId: string): Promise<Student[]> {
        return await this.datasourceUser.getGroupStudents(groupId);
    }

    public async getAllStudents(): Promise<Student[]> {
        return await this.datasourceUser.getAllStudents();
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        return await this.datasourceUser.getAllTeachers();
    }
    public async getStudentsByClassId(classId: string): Promise<Student[]> {
        return await this.datasourceUser.getClassStudents(classId);
    }
    public async getTeachersByClassId(classId: string): Promise<Teacher[]> {
        return await this.datasourceUser.getClassTeachers(classId);
    }
}
