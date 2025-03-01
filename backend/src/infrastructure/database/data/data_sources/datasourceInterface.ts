import { Teacher } from "../../../../core/entities/teacher";

/**
 * Interface for the datasources used in the repositories.
 * These contain the actual connection with the database and contain methods to interact with the database.
 * 
 * Methods like these are the CRUD operations that are used in the repositories.
 */
export interface IDatasource {

    /**
     * Create a teacher in the database.
     * 
     * @param teacher The teacher entity to be created in the database.
     * @returns A promise that resolves to the created teacher entity.
     */
    createTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Get a teacher by their ID from the database.
     * 
     * @param id The id of the teacher
     * @returns A promise that resolves to the teacher entity with the given ID or null if no results are found.
     */
    getTeacherById(id: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their email from the database.
     * 
     * @param email The email of the teacher
     * @returns A promise that resolves to the teacher entity with the given email or null if no results are found.
     */
    getTeacherByEmail(email: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their first name from the database.
     * 
     * @param first_name The first name of the teacher
     * @returns A promise that resolves to the teacher entity with the given first name or null if no results are found.
     */
    getTeacherByFirstName(first_name: string): Promise<Teacher|null>;

    /**
     * Get a teacher by their last name from the database.
     * 
     * @param last_name The last name of the teacher
     * @returns A promise that resolves to the teacher entity with the given last name or null if no results are found.
     */
    getTeacherByLastName(last_name: string): Promise<Teacher|null>;

    /**
     * Get all teachers from the database.
     * 
     * @returns A promise that resolves to an array of all teacher entities, empty array if no results.
     */
    getAllTeachers(): Promise<Teacher[]>;

    /**
     * Update a teacher in the database.
     * 
     * @param teacher The teacher entity to be updated in the database.
     * @returns A promise that resolves to the updated teacher entity.
     */
    updateTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Delete a teacher from the database.
     * 
     * @param id The id of the teacher entity to be deleted from the database.
     */
    deleteTeacherWithId(id: string): Promise<void>;

}
