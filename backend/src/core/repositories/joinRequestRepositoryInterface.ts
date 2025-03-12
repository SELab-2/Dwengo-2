import { JoinRequest } from "../entities/joinRequest";
import { AbstractRepository } from "./abstractRepository";

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
    public abstract createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest>;

    /**
     * Get a join request by its id.
     * @param id The id of the join request
     * @throws EntityNotFoundError when no join request is found.
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
