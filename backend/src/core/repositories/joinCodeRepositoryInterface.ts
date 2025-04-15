import { AbstractRepository } from "./abstractRepository";

/**
 * Interface for join code repositories.
 * Allows CRUD operations on join code entities.
 */
export abstract class IJoinCodeRepository extends AbstractRepository {
    /**
     * Get an active join code for a class.
     * If no active join code exists yet,
     * One is created and returned
     * @param classId The id of the class.
     * @returns A promise that resolves to the alphanumeric 6 letter join code.
     */
    public abstract getByClassId(classId: string): Promise<string>;

    /**
     * Marks a join code as expired.
     * No students will be able to use this join code after the code is expired.
     * @param code The actual alphanumerical code as a string.
     */
    public abstract setExpired(code: string): Promise<void>;
}
