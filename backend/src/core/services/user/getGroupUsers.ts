import { z } from "zod";
import { getGroupUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export type GetGroupUsersInput = z.infer<typeof getGroupUsersSchema>;

export class GetGroupUsers implements Service<GetGroupUsersInput> {
    constructor(private studentRepository: IStudentRepository) {}

    /**
     * Executes the group users get process.
     * @param input - The input data for getting group users, validated by getGroupUsersSchema.
     * @returns A promise resolving to an object with a list of users.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(input: GetGroupUsersInput): Promise<object> {
        const students: Student[] = await tryRepoEntityOperation(
            this.studentRepository.getByGroupId(input.idParent),
            "Group",
            input.idParent,
            true,
        );
        return { students: students.map(s => s.id) };
    }
}
