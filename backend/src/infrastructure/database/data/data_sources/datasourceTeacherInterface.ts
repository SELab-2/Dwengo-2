import { DataSource } from "typeorm";
import { Teacher } from "../../../../core/entities/teacher";

/**
 * Interface for the teacher data source.
 */
export abstract class IDatasourceTeacher {

    public constructor(
        protected datasource: DataSource
    ) {}

    /**
     * Create a teacher in the database.
     * 
     * @param teacher The teacher entity to be created in the database.
     * @returns A promise that resolves to the created teacher entity.
     */
    public abstract createTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Get a teacher by their ID from the database.
     * 
     * @param id The id of the teacher
     * @returns A promise that resolves to the teacher entity with the given ID or null if no results are found.
     */
    public abstract getTeacherById(id: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their email from the database.
     * 
     * @param email The email of the teacher
     * @returns A promise that resolves to the teacher entity with the given email or null if no results are found.
     */
    public abstract getTeacherByEmail(email: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their first name from the database.
     * 
     * @param first_name The first name of the teacher
     * @returns A promise that resolves to the teacher entity with the given first name or null if no results are found.
     */
    public abstract getTeacherByFirstName(first_name: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their last name from the database.
     * 
     * @param last_name The last name of the teacher
     * @returns A promise that resolves to the teacher entity with the given last name or null if no results are found.
     */
    public abstract getTeacherByLastName(last_name: string): Promise<Teacher|null>;

    /**
     * Get all teachers from the database.
     * 
     * @returns A promise that resolves to an array of all teacher entities, empty array if no results.
     */
    public abstract getAllTeachers(): Promise<Teacher[]>;

    /**
     * Update a teacher in the database.
     * 
     * @param teacher The teacher entity to be updated in the database.
     * @returns A promise that resolves to the updated teacher entity.
     */
    public abstract updateTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Delete a teacher from the database.
     * 
     * @param id The id of the teacher entity to be deleted from the database.
     */
    public abstract deleteTeacherWithId(id: string): Promise<void>;

}
