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
        const studentIds = (await this.studentRepository.getByClassId(input.idParent)).map(s => s.id);
        const teacherIds = (await this.teacherRepository.getByClassId(input.idParent)).map(t => t.id);
        return { teachers: teacherIds, students: studentIds };
    }
}
