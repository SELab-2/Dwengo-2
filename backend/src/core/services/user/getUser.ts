import { z } from "zod";
import { ApiError, ErrorCode } from "../../../application/types";
import { EntityNotFoundError } from "../../../config/error";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { getUserSchema } from "./userSchemas";



export type GetUserInput = z.infer<typeof getUserSchema>;

/**
 * @description Class representing the service for getting a user.
 * @param {IStudentRepository} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class GetUser implements Service<GetUserInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Gets a user from the DB by either ID or email.
     *
     * @param input Parameters containing either ID or email and the user type
     * @returns the user with the given id or email.
     *
     * @throws Error if the user is not present.
     */
    async execute(input: GetUserInput): Promise<object> {
        const { getById, getByEmail } =
            input.userType === UserType.STUDENT
                ? {
                      getById: (id: string) => this.studentRepository.getStudentById(id),
                      getByEmail: (email: string) => this.studentRepository.getStudentByEmail(email),
                  }
                : {
                      getById: (id: string) => this.teacherRepository.getTeacherById(id),
                      getByEmail: (email: string) => this.teacherRepository.getTeacherByEmail(email),
                  };

        try {
            const user = await (input.id ? getById(input.id) : getByEmail(input.email as string));
            return user;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `User ${input.userType} with ${input.id ? `ID ${input.id}` : `email ${input.email}`} not found`,
                } as ApiError;
            }
            throw error;
        }
    }
}
