import { AbstractRepository } from "./abstractRepository";
import { JoinRequest, JoinRequestType } from "../entities/joinRequest";

/**
 * Interface for join request repositories.
 * Allows CRUD operations on join request entities.
 */
export abstract class IJoinRequestRepository extends AbstractRepository {
    /**
     * Insert a new join request in the repository. The `id` field of the join request should be empty.
     * The `id` field will be set by the repository to a uuid.
     *
     * @param joinRequest The new join request to insert.
     * @throws EntityNotFoundError when the requester id in `joinRequest` does not exist.
     * @returns A promise that resolves to the inserted join request.
     */
    public abstract create(joinRequest: JoinRequest): Promise<JoinRequest>;

    /**
     * Marks a join code as expired.
     * No students will be able to use this join code after the code is expired.
     * @param code The actual alphanumerical code as a string.
     * @param userId The id of the user that wants to join.
     * @param type The type of the user. The role that the user will get in the class (student or teacher)
     */
    public abstract createUsingCode(code: string, userId: string, type: JoinRequestType): Promise<JoinRequest>;

    /**
     * Get a join request by its id.
     * @param id The id of the join request
     * @throws EntityNotFoundError when no join request is found.
     * @returns A promise that resolves to the join request with the given id or null if no results are found.
     */
    public abstract getById(id: string): Promise<JoinRequest>;

    /**
     * Get all join requests in the repository. Empty list if no join requests are found.
     * @returns A promise that resolves to an array of all join requests.
     */
    public abstract getByRequesterId(requesterId: string): Promise<JoinRequest[]>;

    /**
     * Get all join requests in the repository. Empty list if no join requests are found.
     * @returns A promise that resolves to an array of all join requests
     */
    public abstract getByClassId(classId: string): Promise<JoinRequest[]>;

    /**
     * Delete a join request from the repository.
     * @param id The id of the join request to delete.
     */
    public abstract delete(id: string): Promise<void>;
}
