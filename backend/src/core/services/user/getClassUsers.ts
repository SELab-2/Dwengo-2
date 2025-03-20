import { z } from "zod";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { getClassUsersSchema } from "./userSchemas";



export type GetClassUsersInput = z.infer<typeof getClassUsersSchema>;

export class GetClassUsers implements Service<GetClassUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    async execute(input: GetClassUsersInput): Promise<object> {
        const students: object[] = (await this.studentRepository.getClassStudents(input.classId)).map(s =>
            s.toObject(),
        );
        const teachers: object[] = (await this.teacherRepository.getClassTeachers(input.classId)).map(t =>
            t.toObject(),
        );
        return { teachers: teachers, students: students };
    }
}
