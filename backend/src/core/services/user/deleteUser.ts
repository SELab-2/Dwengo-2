import { z } from "zod";
import { deleteUserSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export class DeleteUser implements Service<DeleteUserInput> {
    constructor(
        private userRepository: IUserRepository,
    ) {}

    /**
     * Executes the user deletion process.
     * @param input - The input data for deleting a user, validated by deleteUserSchema.
     * @returns An empty object.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(input: DeleteUserInput): Promise<object> {
        await tryRepoEntityOperation(this.userRepository.delete(input.id), "User", input.id, true);
        return {};
    }
}
