import { z } from "zod";
import { getUserSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

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
     * Executes the user get process.
     * @param input - The input data for getting a user, validated by getUserSchema.
     * @returns A promise resolving to a user transformed into an object.
     * @throws {ApiError} If the user with the given id was not found.
     */
    async execute(input: GetUserInput): Promise<object> {
        const { getById, getByEmail } =
            input.userType === UserType.STUDENT
                ? {
                      getById: (id: string) => this.studentRepository.getById(id),
                      getByEmail: (email: string) => this.studentRepository.getByEmail(email),
                  }
                : {
                      getById: (id: string) => this.teacherRepository.getById(id),
                      getByEmail: (email: string) => this.teacherRepository.getByEmail(email),
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
