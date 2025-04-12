import { ApiError, ErrorCode } from "../application/types";
import { EntityNotFoundError } from "../config/error";

/**
 * @description Tiny helper to wrap repo calls and handle errors.
 * @param operation - The repo based operation to execute (e.g., getById, getByEmail).
 * @param entity - Entity type (e.g., "User", "Class", "Assignment").
 * @param identifier - ID or email or whatever you're querying by.
 * @param idBased - True if querying by ID, false if by something else (e.g., email).
 * @returns The result of the promise or throws a clean error.
 * @throws {ApiError} If the entity is not found.
 */
export async function tryRepoEntityOperation<T>(
    promise: Promise<T>,
    entity: string,
    identifier: string,
    idBased: boolean = true,
): Promise<T> {
    try {
        return await promise;
    } catch (e) {
        if (e instanceof EntityNotFoundError) {
            throw {
                code: ErrorCode.NOT_FOUND,
                message: `${entity} with ${idBased ? "ID" : "key"} ${identifier} not found`,
            } as ApiError;
        }
        throw e;
    }
}
