import { DataSource } from "typeorm";
import { JoinRequest } from "../../../../core/entities/joinRequest";

/**
 * Interface for the join request data source
 */
export abstract class IDatasourceJoinRequest {
    public constructor(protected datasource: DataSource) {}

    /**
     * Insert a new class in the repository. The `id` field of the class should be empty.
     * The `id` field will be set by the repository to a uuid.
     * Throws an `DatabaseEntryNotFoundError` if the requester does not exist.
     *
     * @param newClass The new class to insert.
     * @returns A promise that resolves to the inserted class.
     */
    public abstract createJoinRequest(joinRequest: JoinRequest): Promise<JoinRequest>;

    /**
     * Get a join request by its id.
     *
     * @param id The id of the join request.
     * @returns A promise that resolves to the join request with the given id or null if no results are found.
     */
    public abstract getJoinRequestById(id: string): Promise<JoinRequest | null>;

    /**
     * Get all join requests by their requesters id.
     *
     * @param requesterId The id of the requester.
     * @returns A promise that resolved to a list of join requests with the given requester id.
     */
    public abstract getJoinRequestByRequesterId(requesterId: string): Promise<JoinRequest[]>;

    /**
     * Get all join requests by their class id.
     *
     * @param classId The id of the class.
     * @returns A promise that resolves to a list of join requests with the given class id.
     */
    public abstract getJoinRequestByClassId(classId: string): Promise<JoinRequest[]>;

    /**
     * Delete a join request by its id.
     *
     * @param id The id of the join request to delete.
     */
    public abstract deleteJoinRequestById(id: string): Promise<void>;
}
