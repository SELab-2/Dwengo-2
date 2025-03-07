import { DataSource } from "typeorm";
import { Student } from "../../../../core/entities/student";

/**
 * Interface for the student data source.
 */
export abstract class IDatasourceStudent {

    public constructor(
        protected datasource: DataSource
    ) {}

    /**
     * Create a student in the database.
     * 
     * @param student The student entity to be created in the database.
     * @returns A promise that resolves to the created student entity.
     */
    public abstract createStudent(student: Student): Promise<Student>;

    /**
     * Get a student by their ID from the database.
     * 
     * @param id The id of the student
     * @returns A promise that resolves to the student entity with the given ID or null if no results are found.
     */
    public abstract getStudentById(id: string): Promise<Student|null>;

    /**
     * Get a student by their email from the database.
     * 
     * @param email The email of the student
     * @returns A promise that resolves to the student entity with the given email or null if no results are found.
     */
    public abstract getStudentByEmail(email: string): Promise<Student|null>;

    /**
     * Get a student by their first name from the database.
     * 
     * @param first_name The first name of the student
     * @returns A promise that resolves to the student entity with the given first name or null if no results are found.
     */
    public abstract getStudentByFirstName(first_name: string): Promise<Student|null>;

    /**
     * Get a student by their last name from the database.
     * 
     * @param last_name The last name of the student
     * @returns A promise that resolves to the student entity with the given last name or null if no results are found.
     */
    public abstract getStudentByLastName(last_name: string): Promise<Student|null>;

    /**
     * Get all students from the database.
     * 
     * @returns A promise that resolves to an array of all student entities, empty array if no results.
     */
    public abstract getAllStudents(): Promise<Student[]>;

    /**
     * Update a student in the database.
     * 
     * @param student The student entity to be updated in the database.
     * @returns A promise that resolves to the updated student entity.
     */
    public abstract updateStudent(student: Student): Promise<Student>;

    /**
     * Delete a student from the database.
     * 
     * @param id The id of the student entity to be deleted from the database.
     */
    public abstract deleteStudentWithId(id: string): Promise<void>;

}
