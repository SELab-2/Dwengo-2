import { AbstractRepository } from "./abstractRepository";
import { JoinCode } from "../../core/entities/joinCode";

/**
 * Interface for join code repositories.
 * Allows CRUD operations on join code entities.
 */
export abstract class IJoinCodeRepository extends AbstractRepository {
    /**
     * Creates a new join code for a class.
     * @param joinCode The joinCode to add.
     * @returns A promise that resolves to the created JoinCode entity.
     */
    public abstract create(joinCode: JoinCode): Promise<JoinCode>;

    /**
     * Get a join code by its code.
     * @param code The alphanumeric join code.
     * @returns A promise that resolves to the JoinCode entity.
     * @throws EntityNotFoundError if the join code is not found.
     */
    public abstract getById(code: string): Promise<JoinCode>;

    /**
     * Get an active join code for a class.
     * If no active join code exists yet, one is created and returned.
     * @param classId The id of the class.
     * @returns A promise that resolves to the JoinCode entity.
     */
    public abstract getByClassId(classId: string): Promise<JoinCode[]>;

    /**
     * Updates a join code as expired.
     * If set to expired no student will be able to use this join code after it is expired.
     * @param joinCode The joinCode to update.
     * @returns A promise that resolves to the JoinCode entity.
     */
    public abstract update(joinCode: JoinCode): Promise<JoinCode>;

    /**
     * Deletes a join code.
     * @param code The alphanumeric join code.
     */
    public abstract delete(code: string): Promise<void>;
}
