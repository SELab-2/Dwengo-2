import { z } from "zod";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export const getAllUsersSchema = z.object({});

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;

export class GetAllUsers implements Service<GetAllUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    async execute(): Promise<object> {
        const students = (await this.studentRepository.getAllStudents()).map(student => student.toObject());
        const teachers = (await this.teacherRepository.getAllTeachers()).map(teacher => teacher.toObject());
        return { students: students, teachers: teachers };
    }
}
