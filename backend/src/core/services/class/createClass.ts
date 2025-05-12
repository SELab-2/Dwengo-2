import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { createClassSchema } from "../../../application/schemas/classSchemas";
import { ClassTypeORM as Class } from "../../../infrastructure/database/data/data_models/classTypeorm";
import { JoinRequestType } from "../../entities/joinRequest";
import { tryRepoEntityOperation } from "../../helpers";

export type CreateClassInput = z.infer<typeof createClassSchema>;

export class CreateClass extends ClassBaseService<CreateClassInput> {
    /**
     * Executes the class creation process.
     * @param input - The input data for creating a class, validated by createClassSchema.
     * @returns A promise resolving to an object containing the ID of the created class.
     * @throws {ApiError} If the class with the given teacherId is not found or if the creation fails.
     */
    async execute(input: CreateClassInput): Promise<object> {
        const newClass = new Class();
        newClass.name = input.name;
        newClass.description = input.description;
        newClass.targetAudience = input.targetAudience;

        const createdClass = await tryRepoEntityOperation(
            this.classRepository.create(newClass),
            "Teacher",
            input.name,
            true,
        );

        // Add the teacher who created the class to the class too
        await tryRepoEntityOperation(
            this.classRepository.addUserToClass(createdClass.id, input.teacherId, JoinRequestType.TEACHER),
            "Teacher",
            input.teacherId,
            true,
        );

        return { id: createdClass.id };
    }
}
