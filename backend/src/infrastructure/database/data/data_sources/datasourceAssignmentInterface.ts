import { DataSource } from "typeorm";
import { Assignment } from "../../../../core/entities/assignment";

/**
 * Interface for the assignment data source
 */
export abstract class IDatasourceAssignment {
    public constructor(protected datasource: DataSource) {}

    /**
     * Insert a new assignment in the database. The `id` field of the assignment should be empty.
     * The `id` field will be set by the database to a uuid.
     *
     * @param assignment The new assignment to insert.
     * @param teacherId The id of the teacher that is creating the assignment.
     * @returns A promise that resolves to the inserted assignment.
     */
    public abstract createAssignment(assignment: Assignment, teacherId: string): Promise<Assignment>;

    /**
     * Get an assignment by its id.
     *
     * @param id The id of the assignment.
     * @returns A promise that resolves to the assignment with the given id or null if no results are found.
     */
    public abstract getAssignmentById(id: string): Promise<Assignment | null>;

    /**
     * Get all assignments with a specific class id.
     *
     * @param classId The id of the class.
     * @returns A promise that resolves to an array of all assignments with the given class id.
     */
    public abstract getAssignmentsByClassId(classId: string): Promise<Assignment[]>;

    /**
     * Get all assignments of a specific user.
     *
     * @param userId The user id.
     * @returns A promise that resolves to an array of all assignments of the user.
     */
    public abstract getAssignmentsByUserId(userId: string): Promise<Assignment[]>;

    /**
     * Get all assignments with a specific learning path id.
     *
     * @param learningPathId The id of the learning path.
     * @returns A promise that resolves to an array of all assignments with the given learning path id.
     */
    public abstract getAssignmentsByLearningPathId(learningPathId: string): Promise<Assignment[]>;

    /**
     * Delete an assignment by its id.
     *
     * @param id The id of the assignment to delete.
     * @returns A promise that resolves when the assignment is deleted.
     */
    public abstract deleteAssignmentById(id: string): Promise<void>;

    /**
     * Update an assignment by it's id and the fields to update.
     *
     * @param id The assignment id
     * @param updatedFields The fields to update
     * @returns A promise that resolves to the updated assignment.
     */
    public abstract updateAssignmentById(id: string, updatedFields: Partial<Assignment>): Promise<Assignment | null>;
}
