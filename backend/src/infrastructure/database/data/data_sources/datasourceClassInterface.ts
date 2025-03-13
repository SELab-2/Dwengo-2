import { DataSource } from "typeorm";
import { Class } from "../../../../core/entities/class";
import { JoinRequestType } from "../../../../core/entities/joinRequest";

/**
 * Interface for the class data source
 */
export abstract class IDatasourceClass {

    public constructor(
        protected datasource: DataSource
    ) {}

    /**
     * Insert a new class in the database. The `id` field of the class should be empty.
     * The `id` field will be set by the database to a uuid.
     * 
     * @param newClass The new class to insert.
     * @returns A promise that resolves to the inserted class.
     */
    public abstract createClass(newClass: Class): Promise<Class>;

    /**
     * Get a class by its id.
     * 
     * @param id The id of the class.
     * @returns A promise that resolves to the class with the given id or null if no results are found.
     */
    public abstract getClassById(id: string): Promise<Class|null>;
    
    /**
     * Get a class by its name.
     * 
     * @param name The name of the class.
     * @returns A promise that resolves to the class with the given name or null if no results are found.
     */
    public abstract getClassByName(name: string): Promise<Class|null>;

    /**
     * Get all classes in the database.
     * 
     * @returns A promise that resolves to an array of all classes.
     */
    public abstract getAllClasses(): Promise<Class[]>;

    /**
     * Delete a class by its id.
     * 
     * @param id The id of the class to delete.
     */
    public abstract deleteClassById(id: string): Promise<void>;

    /**
     * Get all classes that a user is a member of.
     * 
     * @param id The id of the user
     * @throws EntityNotFoundError If the user does not exist.
     */
    public abstract getUserClasses(id: string): Promise<Class[]>;

    /**
     * Add a user to a class.
     * 
     * @param classId The id of the class
     * @param userId The id of the user
     * @param userType The type of the user (teacher or student)
     */
    public abstract addUserToClass(classId: string, userId: string, userType: JoinRequestType): Promise<void>;

}
