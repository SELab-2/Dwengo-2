import { z } from "zod";
import { getGroupUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type GetGroupUsersInput = z.infer<typeof getGroupUsersSchema>;

export class GetGroupUsers implements Service<GetGroupUsersInput> {
    constructor(private userRepository: IUserRepository) {}

    /**
     * Executes the group users get process.
     * @param input - The input data for getting group users, validated by getGroupUsersSchema.
     * @returns A promise resolving to an object with a list of users.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(input: GetGroupUsersInput): Promise<object> {
        const students: Student[] = await tryRepoEntityOperation(
            this.userRepository.getByGroupId(input.idParent),
            "Group",
            input.idParent,
            true,
        );
        return { students: students.map(s => s.id) };
    }
}
