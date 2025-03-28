import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { getAllClassesSchema, getClassSchema, getUserClassesSchema } from "../../../application/schemas/classSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { EntityNotFoundError } from "../../../config/error";

export type GetClassInput = z.infer<typeof getClassSchema>;

export class GetClass extends ClassBaseService<GetClassInput> {
    /**
     * Gets a class from the DB given its ID/name.
     * @param input object containing either the class ID or name.
     * @returns the class with the given id/name.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassInput): Promise<object> {
        const { id, className } = input;
        try {
            if (id) {
                return (await this.classRepository.getClassById(id)).toObject();
            }
            return (await this.classRepository.getClassByName(className!)).toObject();
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `Class with ID ${input.id!} not found`,
                } as ApiError;
            }
            throw error;
        }
    }
}

export type GetUserClassInput = z.infer<typeof getUserClassesSchema>;

export class GetUserClasses extends ClassBaseService<GetUserClassInput> {
    /**
     * Get all classes for a user.
     * @param input the id of the user.
     * @returns every class for a user.
     * @throws {EntityNotFoundError} if the user could not be found.
     */
    async execute(input: GetUserClassInput): Promise<object> {
        try {
            return { classes: (await this.classRepository.getUserClasses(input.idParent)).map(c => c.toObject()) };
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `User with ID ${input.idParent!} not found`,
                } as ApiError;
            }
            throw error;
        }
    }
}

export type GetAllClassesInput = z.infer<typeof getAllClassesSchema>;

export class GetAllClasses extends ClassBaseService<GetAllClassesInput> {
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     */
    async execute(): Promise<object> {
        return { classes: (await this.classRepository.getAllClasses()).forEach(c => c.toObject()) };
    }
}
