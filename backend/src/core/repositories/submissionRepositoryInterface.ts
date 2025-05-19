import { AbstractRepository } from "./abstractRepository";
import { StatusType, Submission } from "../entities/submission";

export abstract class ISubmissionRepository extends AbstractRepository {
    /**
     * Inserts a new submission into the repository. The `id` field of the submission should be empty.
     * @param submission The submission object to be created.
     * @throws EntityNotFoundError when the assignment that the submission is for, doesnt exist.
     * @throws EntityNotFoundError when the student that submitted the submission does not exist.
     * @returns A promise that resolves to the ID of the created submission.
     */
    public abstract create(submission: Submission): Promise<string>;

    /**
     * Get a submission by its id.
     * @param id The id of the submission.
     * @throws EntityNotFoundError when no submission is found.
     * @returns A promise that resolves to the retrieved submission.
     */
    public abstract getById(id: string): Promise<Submission>;

    /**
     * Updates a submission from the repository.
     * @param id - The submission to update.
     * @returns A promise that resolves when the submission is deleted.
     */
    public abstract update(id: string, status: StatusType): Promise<void>;

    /**
     * Deletes a submission from the repository.
     * @param id - The submission to delete.
     * @returns A promise that resolves when the submission is deleted.
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Get all submissions  of an assignment for a specific student.
     * @param studentId The id of the student.
     * @param assignmentId The id of the assignment.
     * @throws EntityNotFoundError when the assignment or student is not found.
     * @returns A promise that resolves to the retrieved submissions.
     */
    public abstract getAllForStudentInAssignment(studentId: string, assignmentId: string): Promise<Submission[]>;

    /**
     * Get all submissions for a specific student in a specific step of an assignment.
     * @param studentId The id of the student.
     * @param assignmentId The id of the assignment.
     * @param taskId The id of the task.
     * @throws EntityNotFoundError when the assignment or student is not found.
     * @returns A promise that resolves to the retrieved submissions.
     */
    public abstract getAllForStudentInAssignmentStep(
        studentId: string,
        assignmentId: string,
        taskId: string,
    ): Promise<Submission[]>;

    /**
     * Get all submissions for a specific student, for any assignment and step in that assignment.
     * @param studentId The id of the student.
     * @throws EntityNotFoundError when the student is not found.
     * @returns A promise that resolves to the retrieved submissions.
     */
    public abstract getByStudentId(studentId: string): Promise<Submission[]>;

    /**
     * Get the amount of submissions for a class from the last 12 monts
     * @param classId The id of the class
     * @throws EntityNotFoundError when the class is not found
     * @returns A promise that resolves to an array containing the amount of submissions
     */
    public abstract getMonthlySubmissionCounts(classId: string): Promise<number[]>;
}
