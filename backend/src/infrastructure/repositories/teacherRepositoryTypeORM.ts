import { EntityNotFoundError } from "../../config/error";
import { Teacher } from "../../core/entities/teacher";
import { ITeacherRepository } from "../../core/repositories/teacherRepositoryInterface";
import { DatasourceTeacherTypeORM } from "../database/data/data_sources/typeorm/datasourceTeacherTypeORM";

export class TeacherRepositoryTypeORM extends ITeacherRepository {
    private datasourceTeacher: DatasourceTeacherTypeORM;

    public constructor() {
        super();
        this.datasourceTeacher = new DatasourceTeacherTypeORM();
    }

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        return await this.datasourceTeacher.createTeacher(teacher);
    }

    public async getTeacherById(id: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherById(id);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with id: ${id} not found`);
        }
    }

    async checkTeacherByEmail(email: string): Promise<boolean> {
        try {
            const teacher: Teacher = await this.getTeacherByEmail(email);
            return teacher !== null;
        } catch (EntityNotFoundError) {
            return false;
        }
    }

    public async getTeacherByEmail(email: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByEmail(email);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with email: ${email} not found`);
        }
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByFirstName(first_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with first name: ${first_name} not found`);
        }
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByLastName(last_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with last name: ${last_name} not found`);
        }
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        return await this.datasourceTeacher.getAllTeachers();
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        return await this.datasourceTeacher.updateTeacher(teacher);
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        return await this.datasourceTeacher.deleteTeacherWithId(id);
    }

    public async deleteTeacherFromClass(teacherId: string, classId: string): Promise<void> {
        return await this.datasourceTeacher.deleteTeacherFromClass(teacherId, classId);
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        return await this.datasourceTeacher.getClassTeachers(classId);
    }
}
