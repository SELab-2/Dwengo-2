import { AbstractRepository } from "./abstractRepository";
import { Step } from "../../core/entities/step";

/**
 * Interface for step repositories.
 * Allows CRUD operations on step entities.
 */
export abstract class IStepRepository extends AbstractRepository {
    /**
     * Creates a new step for a assignment.
     * @param step The step to add.
     * @returns A promise that resolves to the created Step entity.
     */
    public abstract create(step: Step): Promise<Step>;

    /**
     * Get a step by its id.
     * @param id The alphanumeric id.
     * @returns A promise that resolves to the Step entity.
     * @throws EntityNotFoundError if the step is not found.
     */
    public abstract getById(id: string): Promise<Step>;

    /**
     * Get an active step for an assignment.
     * @param assignmentId The id of the assignment.
     * @returns A promise that resolves to the Step entity.
     * @throws EntityNotFoundError if the step is not found.
     */
    public abstract getByAssignmentId(assignmentId: string): Promise<Step[]>;

    /**
     * Get an active step for an assignment object.
     * If no active step exists yet, one is created and returned.
     * @param assignmentId The id of the assignment.
     * @returns A promise that resolves to the Step entity.
     * @throws EntityNotFoundError if the step is not found.
     */
    public abstract getByAssignmentObjectId(assignmentId: string, learningObjectId: string): Promise<Step[]>;

    /**
     * Updates a step as expired.
     * If set to expired no student will be able to use this step after it is expired.
     * @param step The step to update.
     * @returns A promise that resolves to the Step entity.
     */
    public abstract update(step: Step): Promise<Step>;

    /**
     * Deletes a step.
     * @param id The alphanumeric id.
     */
    public abstract delete(id: string): Promise<void>;
}
