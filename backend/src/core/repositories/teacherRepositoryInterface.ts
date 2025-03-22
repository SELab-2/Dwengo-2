import { AbstractRepository } from "./abstractRepository";
import { Teacher } from "../entities/teacher";

/**
 * Interface for teacher repositories.
 * Allows CRUD operations on teacher entities.
 */
export abstract class ITeacherRepository extends AbstractRepository {
    /**
     * Insert a new teacher in the repository. The `id` field of the teacher should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param teacher The new teacher to insert.
     * @returns A promise that resolves to the inserted teacher.
     */
    public abstract create(teacher: Teacher): Promise<Teacher>;

    /**
     * Get a teacher by its id.
     * @param id The id of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given id or null if no results are found.
     */
    public abstract getById(id: string): Promise<Teacher>;

    /**
     * Check if a teacher with this email exists.
     * @param email The email of the teacher
     * @returns A promise that resolves to a boolean, true if email is already in use false otherwise.
     */
    public abstract checkByEmail(email: string): Promise<boolean>;

    /**
     * Get a teacher by their email.
     * @param email The email of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given email or null if no results are found.
     */
    public abstract getByEmail(email: string): Promise<Teacher>;

    /**
     * Get a teacher by their first name.
     * @param first_name The first name of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given first name.
     */
    public abstract getByFirstName(first_name: string): Promise<Teacher>;

    /**
     * Get a teacher by their last name.
     * @param last_name The last name of the teacher
     * @throws EntityNotFoundError when no teacher is found.
     * @returns A promise that resolves to the teacher with the given last name.
     */
    public abstract getByLastName(last_name: string): Promise<Teacher>;

    /**
     * Get all teachers in the repository.
     * @returns A promise that resolves to an array of all teachers.
     */
    public abstract getAll(): Promise<Teacher[]>;

    /**
     * Update an existing teacher in the repository.
     * @param teacher The teacher to update.
     * @returns A promise that resolves to the updated teacher.
     */
    public abstract update(teacher: Teacher): Promise<Teacher>;

    /**
     * Delete a teacher from the repository.
     * @param id The id of the teacher to delete.
     */
    public abstract deleteById(id: string): Promise<void>;

    /**
     * Delete a teacher from a class.
     * @param teacherId The id of the teacher to delete.
     * @param classId The class to delete the teacher from.
     */
    public abstract removeFromClass(teacherId: string, classId: string): Promise<void>;

    /**
     * Get all teachers for a class.
     * @param classId
     * @returns the ids of the teachers
     * @throws {EntityNotFoundError} when the class doesn't exist.
     */
    public abstract getByClassId(classId: string): Promise<Teacher[]>;
}
