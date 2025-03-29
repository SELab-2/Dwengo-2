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
        const studentIds = (await this.studentRepository.getAllStudents()).map(student => student.id);
        const teacherIds = (await this.teacherRepository.getAllTeachers()).map(teacher => teacher.id);
        return { students: studentIds, teachers: teacherIds };
    }
}
