import { z } from "zod";
import { getAssignmentUsersSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type GetAssignmentUsersInput = z.infer<typeof getAssignmentUsersSchema>;

export class GetAssignmentUsers implements Service<GetAssignmentUsersInput> {
    constructor(private userRepository: IUserRepository) {}

    /**
     * Executes the assignment users get process.
     * @param input - The input data for getting assignment users, validated by getAssignmentUsersSchema.
     * @returns A promise resolving to an object with a list of users.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: GetAssignmentUsersInput): Promise<object> {
        const students: Student[] = await tryRepoEntityOperation(
            this.userRepository.getByAssignmentId(input.idParent),
            "Assignment",
            input.idParent,
            true,
        );
        return { students: students.map(s => s.id) };
    }
}
