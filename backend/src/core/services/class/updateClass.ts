import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { updateClassSchema } from "../../../application/schemas/classSchemas";
import { ClassTypeORM as Class } from "../../../infrastructure/database/data/data_models/classTypeorm";
import { tryRepoEntityOperation } from "../../helpers";

export type UpdateClassInput = z.infer<typeof updateClassSchema>;

export class UpdateClass extends ClassBaseService<UpdateClassInput> {
    /**
     * Executes the class update process.
     * @param input - The input data for updating a class, validated by updateClassSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the class with the given id is not found.
     */
    async execute(input: UpdateClassInput): Promise<object> {
        // Object met alleen de velden die worden bijgewerkt
        const updatedFields: Partial<Class> = {};
        if (input.name) updatedFields.name = input.name;
        if (input.description) updatedFields.description = input.description;
        if (input.targetAudience) updatedFields.targetAudience = input.targetAudience;

        await tryRepoEntityOperation(this.classRepository.update(input.id, updatedFields), "Class", input.id, true);
        return {};
    }
}
