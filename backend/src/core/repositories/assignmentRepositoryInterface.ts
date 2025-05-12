import { AbstractRepository } from "./abstractRepository";
import { AssignmentTypeORM as Assignment } from "../../infrastructure/database/data/data_models/assignmentTypeorm";

/**
 * Interface for assignment repositories.
 * Allows CRUD operations on assignment entities.
 */
export abstract class IAssignmentRepository extends AbstractRepository {
    /**
     * Inserts a new assignment into the repository. The `id` field of the assignment should be empty.
     * @param assignment The assignment object to be created.
     * @throws EntityNotFoundError when no the class that the assigment belongs to does not exist.
     * @returns A promise that resolves to the created assignment.
     */
    public abstract create(assignment: Assignment): Promise<Assignment>;

    /**
     * Get an assignment by its id.
     * @param id The id of the assignment.
     * @throws EntityNotFoundError when no assignment is found.
     * @returns A promise that resolves to the retrieved assignment.
     */
    public abstract getById(id: string): Promise<Assignment>;

    /**
     * Get all assignments associated with a specific class id.
     * @param classId The id of the class
     * @returns A promise that resolves to an array of assignments.
     */
    public abstract getByClassId(classId: string): Promise<Assignment[]>;

    /**
     * Get all assignments associated with a specific user id.
     * @param classId The id of the user
     * @returns A promise that resolves to an array of assignments.
     */
    public abstract getByUserId(userId: string): Promise<Assignment[]>;

    /**
     * Get all assignments associated with a specific learning path id.
     * @param learningPathId The id of the learning path
     * @returns A promise that resolves to an array of assignments.
     */
    public abstract getByLearningPathId(learningPathId: string): Promise<Assignment[]>;

    /**
     * Deletes an assignment by its id.
     * @param id - The id of the assignment to delete.
     * @returns A promise that resolves when the assignment is deleted.
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Updates an assignment by its id.
     * @param id - The id of the assignment to update
     * @param updatedFields - The fields that need to be updated
     * @returns A promise that resolves to the Assignment that is updated
     * @throws EntityNotFound error when the assignment that needs to be updated does not exist
     */
    public abstract update(updatedFields: Assignment): Promise<Assignment>;
}
