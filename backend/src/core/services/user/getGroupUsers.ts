import { z } from "zod";
import { Service } from "../../../config/service";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export const getGroupUsersSchema = z.object({
    groupId: z.string(),
});

export type GetGroupUsersInput = z.infer<typeof getGroupUsersSchema>;

export class GetGroupUsers implements Service<GetGroupUsersInput> {
    constructor(private studentRepository: IStudentRepository) {}

    async execute(input: GetGroupUsersInput): Promise<object> {
        const students: object[] = (await this.studentRepository.getGroupStudents(input.groupId)).map(s =>
            s.toObject(),
        );
        return { students: students };
    }
}
