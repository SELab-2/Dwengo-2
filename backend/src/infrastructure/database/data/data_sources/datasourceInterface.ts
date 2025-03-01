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

}
