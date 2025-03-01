import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Teacher } from "../entities/teacher";

/**
 * Interface for teacher repositories.
 * Allows CRUD operations on teacher entities.
 */
export abstract class ITeacherRepository {

    /**
     * @param datasourceFactory Factory for creating datasources.
     */
    public constructor(
        protected datasourceFactory: IDatasourceFactory
    ) {}

    /* TODO: idea?
    getTeacherByPredicate(predicate: (teacher: Teacher) => boolean): Promise<Teacher[]>; ??
    */

    /**
     * Insert a new teacher in the repository.
     * @param teacher The new teacher to insert.
     * @returns A promise that resolves to the inserted teacher.
     */
    public abstract createTeacher(teacher: Teacher): Promise<Teacher>;

    /**
     * Get a teacher by its id.
     * @param id The id of the teacher
     * @returns A promise that resolves to the teacher with the given id.
     */
    public abstract getTeacherById(id: string): Promise<Teacher>;

    /**
     * Get a teacher by their email.
     * @param email The email of the teacher
     * @returns A promise that resolves to the teacher with the given email.
     */
    public abstract getTeacherByEmail(email: string): Promise<Teacher>;

    /**
     * Get a teacher by their first name.
     * @param first_name The first name of the teacher
     * @returns A promise that resolves to the teacher with the given first name.
     */
    public abstract getTeacherByFirstName(first_name: string): Promise<Teacher>;

    /**
     * Get a teacher by their last name.
     * @param last_name The last name of the teacher
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
     * @param teacher The teacher to delete.
     * @returns A promise that resolves to the deleted teacher.
     */
    public abstract deleteTeacher(teacher: Teacher): Promise<Teacher>;
}
