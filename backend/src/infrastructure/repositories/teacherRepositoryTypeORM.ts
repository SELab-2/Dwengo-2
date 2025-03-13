import { EntityNotFoundError } from "../../config/error";
import { Teacher } from "../../core/entities/teacher";
import { ITeacherRepository } from "../../core/repositories/teacherRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceTeacher } from "../database/data/data_sources/datasourceTeacherInterface";

export class TeacherRepositoryTypeORM extends ITeacherRepository {
    private datasource: IDatasource;
    private datasourceTeacher: Promise<IDatasourceTeacher>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceTeacher = this.datasource.getDatasourceTeacher();
    }

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).createTeacher(teacher);
    }

    public async getTeacherById(id: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherById(id);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with id: ${id} not found`);
        }
    }

    public async checkTeacherByEmail(email: string): Promise<boolean> {
        const teacher: Teacher = await this.getTeacherByEmail(email);
        return teacher !== null;
    }

    public async getTeacherByEmail(email: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByEmail(email);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with email: ${email} not found`);
        }
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByFirstName(first_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with first name: ${first_name} not found`);
        }
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByLastName(last_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with last name: ${last_name} not found`);
        }
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        return await (await this.datasourceTeacher).getAllTeachers();
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).updateTeacher(teacher);
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        return await (await this.datasourceTeacher).deleteTeacherWithId(id);
    }

    public async deleteTeacherFromClass(teacherId: string, classId: string): Promise<void> {
        return await (await this.datasourceTeacher).deleteTeacherFromClass(teacherId, classId);
    }

    public async getClassTeachers(classId: string): Promise<Teacher[]> {
        return await (await this.datasourceTeacher).getClassTeachers(classId);
    }
}
