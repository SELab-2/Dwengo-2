import { z } from "zod";
import { updateUserSchema } from "../../../application/schemas/userSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Service for updating a user.
 * @param userRepository - Repository for student data.
 * @param teacherRepository - Repository for teacher data.
 */
export class UpdateUser implements Service<UpdateUserInput> {
    constructor(
        private userRepository: IUserRepository
    ) {}

    /**
     * Executes the user update process.
     * @param input - The input data for updating a user, validated by updateUserSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the user with the given id is not found or when a bad request is given.
     */
    async execute(input: UpdateUserInput): Promise<object> {
        // Get the old info of the user
        const oldUser = await tryRepoEntityOperation(this.userRepository.getById(input.id), "User", input.id, true);

        // Check if email is not same when being updated
        if (input.email && oldUser.email === input.email.toLowerCase()) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Email cannot be the same as old one.",
            } as ApiError;
        }

        // Check if email is already in use
        if (input.email) {
            const userPresent: boolean = await this.userRepository.checkByEmail(input.email.toLowerCase());
            if (userPresent) {
                throw {
                    code: ErrorCode.BAD_REQUEST,
                    message: "Email already in use.",
                } as ApiError;
            }
        }

        // Check if password is not same when being updated
        if (input.passwordHash && oldUser.passwordHash === input.passwordHash) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Password cannot be the same as old one.",
            } as ApiError;
        }

        // Create updated user object
        const updatedUser = new User(
                input.email ?? oldUser.email,
                input.firstName ?? oldUser.firstName,
                input.familyName ?? oldUser.familyName,
                input.passwordHash ?? oldUser.passwordHash,
                input.schoolName ?? oldUser.schoolName,
                input.userType,
                input.id,
            );
            
        await tryRepoEntityOperation(this.userRepository.update(updatedUser), "User", "", false);

        return {};
    }
}
