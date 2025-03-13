import { AbstractRepository } from "./abstractRepository";
import { QuestionThread } from "../entities/questionThread";

/**
 * Interface for question thread repositories.
 * Allows CRUD operations on question thread entities.
 */
export abstract class IQuestionThreadRepository extends AbstractRepository {
    /**
     * Insert a new question thread into the repository. The `id` field should be empty.
     * The `id` field will be set by the repository to a UUID.
     * @param thread The new question thread to insert.
     * @throws EntityNotFoundError when the related assignment does not exist.
     * @returns A promise that resolves to the inserted thread.
     */
    public abstract createQuestionThread(thread: QuestionThread): Promise<QuestionThread>;

    /**
     * Retrieve a question thread by its ID. Throws an `EntityNotFoundError` if not found.
     * @param id The ID of the question thread.
     * @throws EntityNotFoundError when no question thread is found.
     * @returns A promise that resolves to the question thread.
     */
    public abstract getQuestionThreadById(id: string): Promise<QuestionThread>;

    /**
     * Retrieve all question threads for a specific assignment.
     * @param assignmentId The ID of the assignment.
     * @throws EntityNotFoundError when the assignment does not exist.
     * @returns A promise that resolves to an array of question threads for the given assignment.
     */
    public abstract getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]>;

    /**
     * Retrieve all question threads created by a specific user.
     * @param creatorId The ID of the user who created the threads.
     * @throws EntityNotFoundError when the creator does not exist.
     * @returns A promise that resolves to an array of question threads created by the given user.
     */
    public abstract getQuestionThreadsByCreatorId(creatorId: string): Promise<QuestionThread[]>;

    /**
     * Update a question thread by its ID. Throws an `EntityNotFoundError` if not found.
     * @param id The ID of the question thread to update.
     * @param updatedThread The updated question thread data.
     * @throws EntityNotFoundError when no question thread is found.
     * @returns A promise that resolves to the updated question thread.
     */
    public abstract updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread>;

    /**
     * Delete a question thread by its ID. Also deletes all messages within the thread.
     * Throws an `EntityNotFoundError` if not found.
     * @param id The ID of the question thread to delete.
     * @throws EntityNotFoundError when no question thread is found.
     * @returns A promise that resolves to void.
     */
    public abstract deleteQuestionThread(id: string): Promise<void>;
}
