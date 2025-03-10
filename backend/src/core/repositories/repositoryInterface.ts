import { AbstractRepository } from "./AbstractRepository";

export abstract class IRepository<Entity> extends AbstractRepository {
    // This class contains all the standard methods/functions that every repository should have.

    // TODO: Combine this class with ``AbstractRepository``. I didn't do this yet so that it would not give any problems.
    // TODO: make all the repository interfaces extend this one.

    /**
     * Insert a new entity in the repository. The `id` field of the entity should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param entity The new entity to insert.
     * @returns A promise that resolves to the inserted entity.
     */
    public abstract create(entity: Entity): Promise<Entity>;

    /**
     * Get a entity by its id.
     * @param id The id of the entity
     * @throws EntityNotFoundError when no entity is found.
     * @returns A promise that resolves to the entity with the given id or null if no results are found.
     */
    public abstract getById(id: string): Promise<Entity>;

    /**
     * Update an existing entity in the repository.
     * @param entity The entity to update.
     * @returns A promise that resolves to the updated entity.
     */
    public abstract update(entity: Entity): Promise<Entity>;

    /**
     * Delete an entity from the repository
     * @param entity The entity to delete.
     */
    public abstract delete(entity: Entity): Promise<void>;

}