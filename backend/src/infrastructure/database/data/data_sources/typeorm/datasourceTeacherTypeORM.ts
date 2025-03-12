import { IDatasourceTeacher } from "../datasourceTeacherInterface";
import { Teacher } from "../../../../../core/entities/teacher";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { TeacherOfClassTypeORM } from "../../data_models/teacherOfClassTypeorm";

export class DatasourceTeacherTypeORM extends IDatasourceTeacher {

    public async createTeacher(teacher: Teacher): Promise<Teacher> {
        const userModel: UserTypeORM = await this.datasource
            .getRepository(UserTypeORM)
            .save(UserTypeORM.createUserTypeORM(teacher));

        const teacherModel: TeacherTypeORM = await this.datasource
            .getRepository(TeacherTypeORM)
            .save(TeacherTypeORM.createTeacherTypeORM(teacher, userModel));

        return teacherModel.toTeacherEntity(teacherModel.teacher);
    }

    public async getTeacherById(id: string): Promise<Teacher|null> {
        const teacherModel: TeacherTypeORM | null = await this.datasource
            .getRepository(TeacherTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["teacher"]
            });

        if (teacherModel !== null) {
            const t: Teacher = teacherModel.toTeacherEntity(teacherModel.teacher);
            console.log(t);
            return t;
        }
        return null; // No result
    }

    public async getTeacherByEmail(email: string): Promise<Teacher|null> {
        const userModel: UserTypeORM|null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { email: email } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM|null = await this.datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByFirstName(first_name: string): Promise<Teacher|null> {
        const userModel: UserTypeORM|null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { first_name: first_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM|null = await this.datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getTeacherByLastName(last_name: string): Promise<Teacher | null> {
        const userModel: UserTypeORM | null = await this.datasource
            .getRepository(UserTypeORM)
            .findOne({ where: { last_name: last_name } });

        if (userModel !== null) {
            const teacherModel: TeacherTypeORM | null = await this.datasource
                .getRepository(TeacherTypeORM)
                .findOne({ where: { teacher: userModel } });

            if (teacherModel !== null) {
                return teacherModel.toTeacherEntity(userModel);
            }
        }
        return null; // No result
    }

    public async getAllTeachers(): Promise<Teacher[]> {
        const teacherModels: TeacherTypeORM[] = await this.datasource
            .getRepository(TeacherTypeORM)
            .find({ relations: ["teacher"] });

        return teacherModels.map((teacherModel: TeacherTypeORM) => teacherModel.toTeacherEntity(teacherModel.teacher));
    }

    public async updateTeacher(teacher: Teacher): Promise<Teacher> {
        await this.datasource.getRepository(UserTypeORM).update(teacher.id!, UserTypeORM.createUserTypeORM(teacher));
        
        // For now, there is no need to update the Teacher table

        return teacher;
    }

    public async deleteTeacherWithId(id: string): Promise<void> {
        const teacherModel: TeacherTypeORM | null = await this.datasource
            .getRepository(TeacherTypeORM)
            .findOne({ 
                where: { id: id },
                relations: ["teacher"]
            });

        // TODO: check if teacherModel!.teacher.id! is not null

        if(teacherModel && teacherModel.teacher.id) {
            await this.datasource.getRepository(UserTypeORM).delete(teacherModel!.teacher.id!);
            await this.datasource.getRepository(TeacherTypeORM).delete(id);
        }
    }

    public async deleteTeacherFromClass(teacherId: string, classId: string): Promise<void> {
        await this.datasource
            .createQueryBuilder()
            .delete()
            .from(TeacherOfClassTypeORM)
            .where("teacher_id = :teacher AND class_id = :class", { teacher: teacherId, class: classId })
            .execute();
    }

}
