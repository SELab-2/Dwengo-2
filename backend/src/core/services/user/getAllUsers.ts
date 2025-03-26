import { z } from "zod";
import { getAllUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type GetAllUsersInput = z.infer<typeof getAllUsersSchema>;

export class GetAllUsers implements Service<GetAllUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    async execute(): Promise<object> {
        const students = (await this.studentRepository.getAll()).map(student => student.toObject());
        const teachers = (await this.teacherRepository.getAll()).map(teacher => teacher.toObject());
        return { students: students, teachers: teachers };
    }
}
