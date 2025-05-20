import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { deleteClassSchema } from "../../../application/schemas/classSchemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type DeleteClassInput = z.infer<typeof deleteClassSchema>;

export class DeleteClass extends ClassBaseService<DeleteClassInput> {
    /**
     * Executes the class deletion process.
     * @param input - The input data for deleting a class, validated by deleteClassSchema.
     * @returns An empty object.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(userId: string, input: DeleteClassInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        await tryRepoEntityOperation(this.classRepository.delete(input.id), "Class", input.id, true);
        return {};
    }
}
