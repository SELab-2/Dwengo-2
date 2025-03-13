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

    /**
     * Removes a student from a class.
     * 
     * @param studentId The id of the student
     * @param classId The class id
     * 
     * @throws Error if student is not in class
     * @throws Error if class does not exist
     */
    public abstract removeStudentFromClass(studentId: string, classId: string): Promise<void>;

    /**
     * Removes a student from a group
     * 
     * @param studentId The id of the student
     * @param groupId The group id
     * 
     * @throws — Error if student is not in group
     * @throws — Error if group does not exist
     */
    public abstract removeStudentFromGroup(studentId: string, groupId: string): Promise<void>;

    /**
   * Assign a student to a group within an assignment. If the assignment is individual,
   * the student will be assigned to a group of 1.
   * @param studentId the student to be assigned.
   * @param groupId the group in the assignment where the student is part of.
   * @throws {EntityNotFoundError} when the student or group could not be found.
   */
  public abstract assignStudentToGroup(studentId: string, groupId: string): Promise<void>

  /**
   * Get all students for a class
   * @param classId 
   * @returns the id of the students
   * @throws {EntityNotFoundError} when the assignment could not be found.
   */
  public abstract getClassStudents(classId: string): Promise<Student[]>

  /**
   * Get all students for an assignment.
   * @param assignmentId 
   * @returns the id of the students
   * @throws {EntityNotFoundError} when the assignment could not be found.
   */
  public abstract getAssignmentStudents(assignmentId: string): Promise<Student[]>

  /**
   * Get all students for a group.
   * @param groupId 
   * @returns the id of the students
   * @throws {EntityNotFoundError} when the group could not be found.
   */
  public abstract getGroupStudents(groupId: string): Promise<Student[]>
}
