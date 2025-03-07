import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Class } from "../entities/class";
import { AbstractRepository } from "./AbstractRepository";

/**
 * Interface for class repositories.
 * Allows CRUD operations on class entities.
 */
/**
 * Interface for a class repository.
 * This interface defines the methods required for interacting with class data.
 */
export abstract class IClassRepository extends AbstractRepository {

    /**
     * Insert a new class in the repository. The `id` field of the class should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param newClass The new class to insert.
     * @returns A promise that resolves to the inserted class.
     */
    public abstract createClass(newClass: Class): Promise<Class>;

    /**
     * Get a class by its id. Throws an `EntityNotFoundError` when no class is found.
     * @param id The id of the class.
     * @returns A promise that resolves to the class with the given id or null if no results are found.
     */
    public abstract getClassById(id: string): Promise<Class>;
    
    /**
     * Get a class by its name. Throws an `EntityNotFoundError` when no class is found.
     * @param name The name of the class.
     * @returns A promise that resolves to the class with the given name or null if no results are found.
     */
    public abstract getClassByName(name: string): Promise<Class>;

    /**
     * Get all classes in the repository.
     * @returns A promise that resolves to an array of all classes.
     */
    public abstract getAllClasses(): Promise<Class[]>;

    /**
     * Delete a class by its id.
     * @param id The id of the class to delete.
     * @returns A promise that resolves when the class is deleted.
     */
    public abstract deleteClassById(id: string): Promise<void>;

}
