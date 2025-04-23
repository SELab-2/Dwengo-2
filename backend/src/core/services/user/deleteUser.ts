import { z } from "zod";
import { deleteUserSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation } from "../../helpers";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export class DeleteUser implements Service<DeleteUserInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Executes the user deletion process.
     * @param input - The input data for deleting a user, validated by deleteUserSchema.
     * @returns An empty object.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(input: DeleteUserInput): Promise<object> {
        if (input.userType == UserType.STUDENT) {
            await tryRepoEntityOperation(this.studentRepository.delete(input.id), "Student", input.id, true);
        } else {
            await tryRepoEntityOperation(this.teacherRepository.delete(input.id), "Teacher", input.id, true);
        }
        return {};
    }
}
