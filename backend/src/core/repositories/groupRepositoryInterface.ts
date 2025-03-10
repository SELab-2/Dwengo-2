import { Group } from "../entities/group";
import { AbstractGenericRepository } from "./abstractGenericRepository";

/**
 * Interface for group repositories.
 * Allows CRUD operations on group entities.
 */
export abstract class IGroupRepository extends AbstractGenericRepository<Group> {

    // All the operations that are specific for the group repository.
    
}
