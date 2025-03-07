import { IDatasourceFactory } from "../../infrastructure/database/data/data_sources/datasourceFactoryInterface";
import { Student } from "../entities/student";

/**
 * Interface for student repositories.
 * Allows CRUD operations on student entities.
 */
export abstract class IStudentRepository {

    /**
     * @param datasourceFactory Factory for creating datasources.
     */
    public constructor(
        protected datasourceFactory: IDatasourceFactory
    ) {}

    /**
     * Insert a new student in the repository. The `id` field of the student should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param student The new student to insert.
     * @returns A promise that resolves to the inserted student.
     */
    public abstract createStudent(student: Student): Promise<Student>;

    /**
     * Get a student by its id.
     * @param id The id of the student
     * @returns A promise that resolves to the student with the given id or null if no results are found.
     */
    public abstract getStudentById(id: string): Promise<Student|null>;

    /**
     * Get a student by their email.
     * @param email The email of the student
     * @returns A promise that resolves to the student with the given email or null if no results are found.
     */
    public abstract getStudentByEmail(email: string): Promise<Student|null>;

    /**
     * Get a student by their first name.
     * @param first_name The first name of the student
     * @returns A promise that resolves to the student with the given first name.
     */
    public abstract getStudentByFirstName(first_name: string): Promise<Student|null>;

    /**
     * Get a student by their last name.
     * @param last_name The last name of the student
     * @returns A promise that resolves to the student with the given last name.
     */
    public abstract getStudentByLastName(last_name: string): Promise<Student|null>;

    /**
     * Get all students in the repository.
     * @returns A promise that resolves to an array of all students.
     */
    public abstract getAllStudents(): Promise<Student[]>;

    /**
     * Update an existing student in the repository.
     * @param student The student to update.
     * @returns A promise that resolves to the updated student.
     */
    public abstract updateStudent(student: Student): Promise<Student>;

    /**
     * Delete a student from the repository.
     * @param id The id of the student to delete.
     */
    public abstract deleteStudentWithId(id: string): Promise<void>;
    
}
