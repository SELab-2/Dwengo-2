import { AbstractRepository } from "./abstractRepository";
import { Submission } from "../entities/submission";

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
     * Deletes a submission from the repository.
     * @param id - The submission to delete.
     * @returns A promise that resolves when the submission is deleted.
     */
    public abstract delete(id: string): Promise<void>;

    /**
     * Get all submissions for a specific student in a specific step of an assignment.
     * @param studentId The id of the student.
     * @param assignmentId The id of the assignment.
     * @param learning_object_id The id of the learning object.
     * @throws EntityNotFoundError when the assignment or student is not found.
     * @returns A promise that resolves to the retrieved submissions.
     */
    public abstract getAllForStudentInAssignmentStep(
        studentId: string,
        assignmentId: string,
        learning_object_id: string,
    ): Promise<Submission[]>;
}
