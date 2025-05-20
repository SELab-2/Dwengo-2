import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { createClassSchema } from "../../../application/schemas/classSchemas";
import { Class } from "../../entities/class";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type CreateClassInput = z.infer<typeof createClassSchema>;

export class CreateClass extends ClassBaseService<CreateClassInput> {
    /**
     * Executes the class creation process.
     * @param input - The input data for creating a class, validated by createClassSchema.
     * @returns A promise resolving to an object containing the ID of the created class.
     * @throws {ApiError} If the class with the given teacherId is not found or if the creation fails.
     */
    async execute(userId: string, input: CreateClassInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);

        const newClass = new Class(input.name, input.description, input.targetAudience, input.teacherId);

        const createdClass = await tryRepoEntityOperation(
            this.classRepository.create(newClass),
            "Teacher",
            newClass.teacherId,
            true,
        );

        return { id: createdClass.id };
    }
}
