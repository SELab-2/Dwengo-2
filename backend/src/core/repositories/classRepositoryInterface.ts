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
     * Get a class by its id.
     * @param id The id of the class.
     * @throws EntityNotFoundError when no class is found.
     * @returns A promise that resolves to the class with the given id or null if no results are found.
     */
    public abstract getClassById(id: string): Promise<Class>;
    
    /**
     * Get a class by its name.
     * @param name The name of the class.
     * @throws EntityNotFoundError when no class is found.
     * @returns A promise that resolves to the class with the given name or null if no results are found.
     */
    public abstract getClassByName(name: string): Promise<Class>;

    /**
     * Get all classes in the repository.
     * @returns A promise that resolves to an array of all classes.
     */
    public abstract getAllClasses(): Promise<Class[]>;

    /**
     * Get all classes for a teacher.
     * @param id the id of the teacher.
     * @returns A promise that resolves to an array of all classes for that teacher.
     * @throws {EntityNotFoundError} when the teacher is not found.
     */
    public abstract getAllClassesByTeacherId(id: string): Promise<Class[]>;

    /**
     * Get all classes where a student is part of.
     * @param id the id of the student.
     * @returns A promise that resolves to an array of all classes for that student.
     * @throws {EntityNotFoundError} when the student is not found.
     */
    public abstract getAllClassesByStudentId(id: string): Promise<Class[]>;

    /**
     * Delete a class by its id.
     * @param id The id of the class to delete.
     * @returns A promise that resolves when the class is deleted.
     */
    public abstract deleteClassById(id: string): Promise<void>;

}
