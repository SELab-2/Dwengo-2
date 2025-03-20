import { z } from "zod";
import { updateUserSchema } from "./userSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Service } from "../../../config/service";
import { Student } from "../../entities/student";
import { Teacher } from "../../entities/teacher";
import { User, UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Service for updating a user.
 * @param studentRepository - Repository for student data.
 * @param teacherRepository - Repository for teacher data.
 */
export class UpdateUser implements Service<UpdateUserInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Executes the update operation.
     *
     * @param input - Parameters containing the updated user info.
     * @returns An empty object.
     */
    async execute(input: UpdateUserInput): Promise<object> {
        // Get the old info of the user
        let oldUser: User;
        if (input.userType == UserType.STUDENT) {
            oldUser = await this.studentRepository.getStudentById(input.id);
        } else {
            oldUser = await this.teacherRepository.getTeacherById(input.id);
        }

        // Check if email is not same when being updated
        if (input.email && oldUser.email === input.email) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Email cannot be the same as old one.",
            } as ApiError;
        }

        // Check if email is already in use
        if (input.email) {
            const studentPresent: boolean = await this.studentRepository.checkByEmail(input.email);
            const teacherPresent: boolean = await this.teacherRepository.checkTeacherByEmail(input.email);
            if (studentPresent || teacherPresent) {
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
        let updatedUser: User;
        if (input.userType == UserType.STUDENT) {
            updatedUser = new Student(
                input.email ?? oldUser.email,
                input.firstName ?? oldUser.firstName,
                input.familyName ?? oldUser.familyName,
                input.passwordHash ?? oldUser.passwordHash,
                input.schoolName ?? oldUser.schoolName,
                input.id,
            );
            await this.studentRepository.updateStudent(updatedUser as Student);
        } else {
            updatedUser = new Teacher(
                input.email ?? oldUser.email,
                input.firstName ?? oldUser.firstName,
                input.familyName ?? oldUser.familyName,
                input.passwordHash ?? oldUser.passwordHash,
                input.schoolName ?? oldUser.schoolName,
                input.id,
            );
            await this.teacherRepository.updateTeacher(updatedUser as Teacher);
        }

        return {};
    }
}
