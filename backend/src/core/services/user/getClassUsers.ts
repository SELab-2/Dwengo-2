import { z } from "zod";
import { getClassUsersSchema } from "../../../application/schemas/userSchemas";

import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type GetClassUsersInput = z.infer<typeof getClassUsersSchema>;

export class GetClassUsers implements Service<GetClassUsersInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    async execute(input: GetClassUsersInput): Promise<object> {
        const students: object[] = (await this.studentRepository.getByClassId(input.idParent)).map(s =>
            s.toObject(),
        );
        const teachers: object[] = (await this.teacherRepository.getByClassId(input.idParent)).map(t =>
            t.toObject(),
        );
        return { teachers: teachers, students: students };
    }
}
