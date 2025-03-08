/*Here comes the interface for the repository for User entity -> Get's implemented in infrastructure/repositories*/

import { Class } from "../entities/class";
import { Student } from "../entities/student";
import { AbstractRepository } from "./AbstractRepository";


export abstract class StudentRepositoryInterface extends AbstractRepository{

    /**
     * Insert a new student in the repository. The `id` field of the student should be empty.
     * The `id` field will be set by the repository to a uuid.
     * @param student The new student to insert.
     * @returns A promise that resolves to the inserted student.
     */
    public abstract createStudent(student: Student): Promise<Student>;

    /**
     * Get a student by its id. Throws an `EntityNotFoundError` when no student is found.
     * @param id The id of the student
     * @returns A promise that resolves to the student with the given id or null if no results are found.
     */
    public abstract getStudentById(id: string): Promise<Student>;

    /**
     * Get a student by their email. Throws an `EntityNotFoundError` when no student is found.
     * @param email The email of the student
     * @returns A promise that resolves to the student with the given email or null if no results are found.
     */
    public abstract getStudentByEmail(email: string): Promise<Student>;

    /**
     * Get a student by their first name. Throws an `EntityNotFoundError` when no student is found.
     * @param first_name The first name of the student
     * @returns A promise that resolves to the student with the given first name.
     */
    public abstract getStudentByFirstName(first_name: string): Promise<Student>;

    /**
     * Get a student by their last name. Throws an `EntityNotFoundError` when no student is found.
     * @param last_name The last name of the student
     * @returns A promise that resolves to the student with the given last name.
     */
    public abstract getStudentByLastName(last_name: string): Promise<Student>;

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