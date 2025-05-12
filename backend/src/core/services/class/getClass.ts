import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { getAllClassesSchema, getClassSchema, getUserClassesSchema } from "../../../application/schemas/classSchemas";
import { ClassTypeORM as Class } from "../../../infrastructure/database/data/data_models/classTypeorm";
import { tryRepoEntityOperation } from "../../helpers";

export type GetClassInput = z.infer<typeof getClassSchema>;

export class GetClass extends ClassBaseService<GetClassInput> {
    /**
     * Executes the class get process.
     * @param input - The input data for getting a class, validated by getClassSchema.
     * @returns A promise resolving to a class transformed into an object.
     * @throws {ApiError} If the class with the given identifier was not found.
     */
    async execute(input: GetClassInput): Promise<object> {
        const { id, name } = input;
        if (id) {
            return await tryRepoEntityOperation(this.classRepository.getById(id), "Class", id, true);
        }
        return await tryRepoEntityOperation(this.classRepository.getByName(name!), "Class", name!, false);
    }
}

export type GetUserClassInput = z.infer<typeof getUserClassesSchema>;

export class GetUserClasses extends ClassBaseService<GetUserClassInput> {
    /**
     * Executes the user classes get process.
     * @param input - The input data for getting user classes, validated by getUserClassesSchema.
     * @returns A promise resolving to an object with a list of classes.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(input: GetUserClassInput): Promise<object> {
        const classes: Class[] = await tryRepoEntityOperation(
            this.classRepository.getByUserId(input.idParent),
            "User",
            input.idParent,
            true,
        );
        return { classes: classes.map(c => c.id) };
    }
}

// TODO - Below is never used

export type GetAllClassesInput = z.infer<typeof getAllClassesSchema>;

export class GetAllClasses extends ClassBaseService<GetAllClassesInput> {
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     */
    async execute(): Promise<object> {
        return { classes: await this.classRepository.getAll() };
    }
}
