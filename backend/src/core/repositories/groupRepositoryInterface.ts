import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Group } from "../entities/group";
import { AbstractRepository } from "./AbstractRepository";
import { IRepository } from "./repositoryInterface";

/**
 * Interface for group repositories.
 * Allows CRUD operations on group entities.
 */
export abstract class IGroupRepository extends IRepository<Group> {

    // All the operations that are specific for the group repository.
    
}
