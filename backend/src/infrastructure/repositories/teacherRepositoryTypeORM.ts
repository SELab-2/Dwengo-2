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

    public async create(teacher: Teacher): Promise<Teacher> {
        return await this.datasourceTeacher.createTeacher(teacher);
    }

    public async getById(id: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherById(id);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with id: ${id} not found`);
        }
    }

    async checkByEmail(email: string): Promise<boolean> {
        try {
            const teacher: Teacher = await this.getByEmail(email);
            return teacher !== null;
        } catch (EntityNotFoundError) {
            return false;
        }
    }

    public async getByEmail(email: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByEmail(email);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with email: ${email} not found`);
        }
    }

    public async getByFirstName(first_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByFirstName(first_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with first name: ${first_name} not found`);
        }
    }

    public async getByLastName(last_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await this.datasourceTeacher.getTeacherByLastName(last_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with last name: ${last_name} not found`);
        }
    }

    public async getAll(): Promise<Teacher[]> {
        return await this.datasourceTeacher.getAllTeachers();
    }

    public async update(teacher: Teacher): Promise<Teacher> {
        return await this.datasourceTeacher.updateTeacher(teacher);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceTeacher.deleteTeacherWithId(id);
    }

    public async removeFromClass(teacherId: string, classId: string): Promise<void> {
        return await this.datasourceTeacher.deleteTeacherFromClass(teacherId, classId);
    }

    public async getByClassId(classId: string): Promise<Teacher[]> {
        return await this.datasourceTeacher.getClassTeachers(classId);
    }
}
