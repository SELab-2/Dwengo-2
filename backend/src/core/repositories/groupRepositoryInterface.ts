import { Group } from "../entities/group";
import { AbstractGenericRepository } from "./abstractGenericRepository";

/**
 * Interface for group repositories.
 * Allows CRUD operations on group entities.
 */
export abstract class IGroupRepository extends AbstractGenericRepository<Group> {

    // All the operations that are specific for the group repository.

    /**
     * Get all groups that belong to a class.
     * @param classId The id of the class.
     * @returns A promise that resolves to an array of groups.
     * @throws EntityNotFoundError when no groups are found.
     */
    public abstract getByClassId(classId: string): Promise<Group[]>;

    /**
     * Get all groups that a user is a member of.
     * @param userId The id of the user.
     * @returns A promise that resolves to an array of groups.
     * @throws EntityNotFoundError when no groups are found.
     */
    public abstract getByUserId(userId: string): Promise<Group[]>;
    
}
