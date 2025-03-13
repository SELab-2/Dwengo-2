import { AbstractGenericRepository } from "./abstractGenericRepository";
import { Group } from "../entities/group";

/**
 * Interface for group repositories.
 * Allows CRUD operations on group entities.
 */
export abstract class IGroupRepository extends AbstractGenericRepository<Group> {
    // All the operations that are specific for the group repository.

    /**
     * Get all groups that a user is a member of.
     * @param userId The id of the user.
     * @returns A promise that resolves to an array of groups.
     * @throws EntityNotFoundError when no groups are found.
     */
    public abstract getByUserId(userId: string): Promise<Group[]>;

    /**
     * Get all groups that are associated with an assignment.
     * @param assignmentId The id of the assignment.
     * @returns A promise that resolves to an array of groups.
     * @throws EntityNotFoundError when no groups are found.
     */
    public abstract getByAssignmentId(assignmentId: string): Promise<Group[]>;
}
