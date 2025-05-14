import { z } from "zod";
import { createUserSchema } from "../../../application/schemas/userSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type CreateUserInput = z.infer<typeof createUserSchema>;

export class CreateUser implements Service<CreateUserInput> {
    public constructor(
        private userRepository: IUserRepository,
    ) {}

    /**
     * Executes the user creation process.
     * @param input - The input data for creating a user, validated by createUserSchema.
     * @returns A promise resolving to an object containing the ID of the created user.
     * @throws {ApiError} If the creation fails.
     */
    async execute(input: CreateUserInput): Promise<object> {
        const emailInUse = await this.userRepository.checkByEmail(input.email.toLowerCase());

        if (emailInUse) {
            throw { code: ErrorCode.CONFLICT, message: "Email already in use." } as ApiError;
        }

        let user = new User(input.email, input.firstName, input.familyName, input.passwordHash, input.schoolName, input.userType);
        user = await tryRepoEntityOperation(this.userRepository.create(user), "User", "", false);
        

        return { id: user.id! };
    }
}
