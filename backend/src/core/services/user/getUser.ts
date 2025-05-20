import { z } from "zod";
import { getUserSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type GetUserInput = z.infer<typeof getUserSchema>;

/**
 * @description Class representing the service for getting a user.
 * @param {IUserRepository} userRepository - The student repository.
 */
export class GetUser implements Service<GetUserInput> {
    constructor(private userRepository: IUserRepository) {}

    /**
     * Executes the user get process.
     * @param input - The input data for getting a user, validated by getUserSchema.
     * @returns A promise resolving to a user transformed into an object.
     * @throws {ApiError} If the user with the given id was not found.
     */
    async execute(_userId: string, input: GetUserInput): Promise<object> {
        const { getById, getByEmail } = {
            getById: (id: string) => this.userRepository.getById(id),
            getByEmail: (email: string) => this.userRepository.getByEmail(email),
        };

        return (
            await tryRepoEntityOperation(
                input.id ? getById(input.id) : getByEmail(input.email?.toLowerCase() as string),
                "User",
                `${input.id ? input.id : input.email?.toLowerCase()}`,
                true,
            )
        ).toObject();
    }
}
