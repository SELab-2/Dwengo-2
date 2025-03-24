import { z } from "zod";
import { getGroupUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export type GetGroupUsersInput = z.infer<typeof getGroupUsersSchema>;

export class GetGroupUsers implements Service<GetGroupUsersInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: GetGroupUsersInput): Promise<object> {
        const students: object[] = (await this.studentRepository.getGroupStudents(input.idParent)).map(s =>
            s.toObject(),
        );
        return { students: students };
    }
}
