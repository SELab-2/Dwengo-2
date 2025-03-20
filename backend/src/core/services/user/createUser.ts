import { z } from "zod";
import { createUserSchema } from "./userSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type CreateUserInput = z.infer<typeof createUserSchema>;

export class CreateUser implements Service<CreateUserInput> {
    public constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * @description Executes the service to create a user.
     * @param input - The input parameters to create a user.
     * @returns {Promise<object>} An object containing the ID of the created user.
     */
    async execute(input: CreateUserInput): Promise<object> {
        const emailInUse = await Promise.all([
            this.studentRepository.checkByEmail(input.email),
            this.teacherRepository.checkTeacherByEmail(input.email),
        ]);

        if (emailInUse.some(present => present)) {
            throw { code: ErrorCode.CONFLICT, message: "Email already in use." } as ApiError;
        }

        let user: User;

        if (input.userType === UserType.STUDENT) {
            user = new Student(input.email, input.firstName, input.familyName, input.passwordHash, input.schoolName);
            user = await this.studentRepository.createStudent(user as Student);
        } else {
            user = new Teacher(input.email, input.firstName, input.familyName, input.passwordHash, input.schoolName);
            user = await this.teacherRepository.createTeacher(user as Teacher);
        }

        return { id: user.id! };
    }
}
