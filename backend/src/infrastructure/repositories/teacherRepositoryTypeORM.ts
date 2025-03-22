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

    public async create(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).createTeacher(teacher);
    }

    public async getById(id: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherById(id);

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
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByEmail(email);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with email: ${email} not found`);
        }
    }

    public async getByFirstName(first_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByFirstName(first_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with first name: ${first_name} not found`);
        }
    }

    public async getByLastName(last_name: string): Promise<Teacher> {
        const teacher: Teacher | null = await (await this.datasourceTeacher).getTeacherByLastName(last_name);

        if (teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Teacher with last name: ${last_name} not found`);
        }
    }

    public async getAll(): Promise<Teacher[]> {
        return await (await this.datasourceTeacher).getAllTeachers();
    }

    public async update(teacher: Teacher): Promise<Teacher> {
        return await (await this.datasourceTeacher).updateTeacher(teacher);
    }

    public async deleteById(id: string): Promise<void> {
        return await (await this.datasourceTeacher).deleteTeacherWithId(id);
    }

    public async removeFromClass(teacherId: string, classId: string): Promise<void> {
        return await (await this.datasourceTeacher).deleteTeacherFromClass(teacherId, classId);
    }

    public async getByClassId(classId: string): Promise<Teacher[]> {
        return await (await this.datasourceTeacher).getClassTeachers(classId);
    }
}
