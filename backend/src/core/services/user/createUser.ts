import { z } from "zod";
import { createUserSchema } from "../../../application/schemas/userSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type CreateUserInput = z.infer<typeof createUserSchema>;

export class CreateUser implements Service<CreateUserInput> {
    public constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Executes the user creation process.
     * @param input - The input data for creating a user, validated by createUserSchema.
     * @returns A promise resolving to an object containing the ID of the created user.
     * @throws {ApiError} If the creation fails.
     */
    async execute(input: CreateUserInput): Promise<object> {
        const emailInUse = await Promise.all([
            this.studentRepository.checkByEmail(input.email.toLowerCase()),
            this.teacherRepository.checkByEmail(input.email.toLowerCase()),
        ]);

        if (emailInUse.some(present => present)) {
            throw { code: ErrorCode.CONFLICT, message: "Email already in use." } as ApiError;
        }

        let user: User;

        if (input.userType === UserType.STUDENT) {
            user = new Student(input.email, input.firstName, input.familyName, input.passwordHash, input.schoolName);
            user = await tryRepoEntityOperation(this.studentRepository.create(user as Student), "User", "", false);
        } else {
            user = new Teacher(input.email, input.firstName, input.familyName, input.passwordHash, input.schoolName);
            user = await tryRepoEntityOperation(this.teacherRepository.create(user as Teacher), "User", "", false);
        }

        return { id: user.id! };
    }
}
