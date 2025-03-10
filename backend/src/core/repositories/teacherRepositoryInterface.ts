import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Teacher } from "../entities/teacher";
import { AbstractRepository } from "./AbstractRepository";

/**
 * Interface for teacher repositories.
 * Allows CRUD operations on teacher entities.
 */
export abstract class ITeacherRepository extends AbstractRepository {


    /**
     * Check if a teacher with the given email exists in the repository.
     * @param email The email to check for.
     * @returns A promise that resolves to true if a teacher with the given email exists, false otherwise.
     */
    public abstract checkTeacherByEmail(email: string): boolean | PromiseLike<boolean>;

    /**
     * Insert a new teacher in the repository. The `id` field of the teacher should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param teacher The new teacher to insert.
     * @returns A promise that resolves to the inserted teacher.
     */
    public abstract createTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Get a teacher by its id.
     * @param id The id of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given id or null if no results are found.
     */
    public abstract getTeacherById(id: string): Promise<Teacher>;

    /**
     * Get a teacher by their email.
     * @param email The email of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given email or null if no results are found.
     */
    public abstract getTeacherByEmail(email: string): Promise<Teacher>;

    /**
     * Get a teacher by their first name.
     * @param first_name The first name of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given first name.
     */
    public abstract getTeacherByFirstName(first_name: string): Promise<Teacher>;

    /**
     * Get a teacher by their last name.
     * @param last_name The last name of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given last name.
     */
    public abstract getTeacherByLastName(last_name: string): Promise<Teacher>;

    /**
     * Get all teachers in the repository.
     * @returns A promise that resolves to an array of all teachers.
     */
    public abstract getAllTeachers(): Promise<Teacher[]>;

    /**
     * Update an existing teacher in the repository.
     * @param teacher The teacher to update.
     * @returns A promise that resolves to the updated teacher.
     */
    public abstract updateTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Delete a teacher from the repository.
     * @param id The id of the teacher to delete.
     */
    public abstract deleteTeacherWithId(id: string): Promise<void>;
    
}
