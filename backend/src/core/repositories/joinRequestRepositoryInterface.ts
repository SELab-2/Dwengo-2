import { JoinRequest } from "../entities/joinRequest";
import { AbstractRepository } from "./AbstractRepository";

/**
 * Interface for join request repositories.
 * Allows CRUD operations on join request entities.
 */
export abstract class IJoinRequestRepoistory extends AbstractRepository {

    /**
     * Insert a new join request in the repository. The `id` field of the join request should be empty.
     * The `id` field will be set by the repository to a uuid.
     * 
     * Throws an `EntityNotFoundError` when the requester id does not exist.
     * 
     * @param joinRequest The new join request to insert.
     * @returns A promise that resolves to the inserted join request.
     */
    public abstract createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest>;

    /**
     * Get a join request by its id. Throws an `EntityNotFoundError` when no join request is found.
     * @param id The id of the join request
     * @returns A promise that resolves to the join request with the given id or null if no results are found.
     */
    public abstract getJoinRequestById(id: string): Promise<JoinRequest>;

    /**
     * Get all join requests in the repository. Empty list if no join requests are found.
     * @returns A promise that resolves to an array of all join requests.
     */
    public abstract getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]>;

    /**
     * Get all join requests in the repository. Empty list if no join requests are found.
     * @returns A promise that resolves to an array of all join requests
     */
    public abstract getJoinRequestByClassId(classId: string): Promise<JoinRequest[]>;

    /**
     * Delete a join request from the repository.
     * @param id The id of the join request to delete.
     */
    public abstract deleteJoinRequestById(id: string): Promise<void>;
}
