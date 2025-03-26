import { z } from "zod";
import { deleteUserSchema } from "../../../application/schemas/userSchemas";
import { Service } from "../../../config/service";
import { UserType } from "../../entities/user";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

export class DeleteUser implements Service<DeleteUserInput> {
    constructor(
        private studentRepository: IStudentRepository,
        private teacherRepository: ITeacherRepository,
    ) {}

    /**
     * Delete a user from the DB.
     *
     * @param input Parameters containing the ID of the user to delete.
     * @returns empty object
     * @throws Error if the user that will be deleted does not exist.
     */
    async execute(input: DeleteUserInput): Promise<object> {
        if (input.userType == UserType.STUDENT) {
            await this.studentRepository.delete(input.id);
        } else {
            await this.teacherRepository.delete(input.id);
        }
        return {};
    }
}
