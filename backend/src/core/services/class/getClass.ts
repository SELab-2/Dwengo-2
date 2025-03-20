import { z } from "zod";
import { ClassBaseService } from "./baseClassService";
import { getAllClassesSchema, getClassByIdSchema, getClassByNameSchema, getClassByUserSchema } from "./classSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { EntityNotFoundError } from "../../../config/error";

type GetClassByIdInput = z.infer<typeof getClassByIdSchema>;

export class GetClassByClassId extends ClassBaseService<GetClassByIdInput> {
    /**
     * Gets a class from the DB given its ID.
     * @param input ID of the class to get from the DB.
     * @returns the class with the given id.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassByIdInput): Promise<object> {
        try {
            return (await this.classRepository.getClassById(input.id)).toObject();
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

type GetClassByNameInput = z.infer<typeof getClassByNameSchema>;

export class GetClassByName extends ClassBaseService<GetClassByNameInput> {
    /**
     * Gets a class from the DB given its name.
     * @param input name of the class to get.
     * @returns the class with the given name.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassByNameInput): Promise<object> {
        try {
            return (await this.classRepository.getClassByName(input.className)).toObject();
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `Class with name ${input.className!} not found`,
                } as ApiError;
            }
            throw error;
        }
    }
}

type GetClassByUserInput = z.infer<typeof getClassByUserSchema>;

export class GetUserClasses extends ClassBaseService<GetClassByUserInput> {
    /**
     * Get all classes for a user.
     * @param input the id of the user.
     * @returns every class for a user.
     * @throws {EntityNotFoundError} if the user could not be found.
     */
    async execute(input: GetClassByUserInput): Promise<object> {
        try {
            return { classes: (await this.classRepository.getUserClasses(input.userId)).map(c => c.toObject()) };
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw {
                    code: ErrorCode.NOT_FOUND,
                    message: `User with ID ${input.userId!} not found`,
                } as ApiError;
            }
            throw error;
        }
    }
}

type GetAllClassesInput = z.infer<typeof getAllClassesSchema>;

export class GetAllClasses extends ClassBaseService<GetAllClassesInput> {
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     */
    async execute(): Promise<object> {
        return { classes: (await this.classRepository.getAllClasses()).forEach(c => c.toObject()) };
    }
}
