/*Here comes the interface for the repository for User entity -> Get's implemented in infrastructure/repositories*/

import { Student } from "../entities/student";
import { AbstractRepository } from "./abstractRepository";


export abstract class IStudentRepository extends AbstractRepository {

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
  public abstract deleteStudentById(id: string): Promise<void>;

  /**
   * Function to remove a student from a class.
   *
   * @param studentId ID of student to be removed from class
   * @param classId ID of class from which student is to be removed
   * @returns void
   *
   * @throws Error if student is not in class
   * @throws Error if class does not exist
   */
  public abstract removeStudentFromClass(studentId: string, classId: string): Promise<void>;

  /**
   * Function to remove a student from a group.
   *
   * @param studentId ID of student to be removed from group
   * @param groupId ID of group from which student is to be removed
   * @returns void
   *
   * @throws Error if student is not in group
   * @throws Error if group does not exist
   */
  public abstract removeStudentFromGroup(studentId: string, groupId: string): Promise<void>;

  /**
   * Check if a student is present in the DB.
   * @param email email of the student to be found
   * @returns true if the student is present in the DB, false otherwise.
   */
  public abstract checkByEmail(email: string): Promise<boolean>;

  /**
   * Ask a question about a step in an assignment.
   * @param studentId the id of the student asking the question.
   * @param assignmentId the assignment which contains the step.
   * @param objectId specifies the object which is the subject of the question.
   * @param question the question itself.
   */
  public abstract askQuestionForAssignment(
    studentId: string,
    assignmentId: string,
    objectId: string,
    question: string,
  ): Promise<void>;

  /**
   * Function will send the submission for a step in a assignment.
   *
   * @param studentId the id of the student submitting a step in a assignment.
   * @param assignmentID the assignment that contains the step on which the student wants to submit their answer.
   * @param objectId the id of the object.
   * @param answer the answer provided by the student.
   */
  public abstract sendSubmissionForAssignment(
    studentId: string,
    objectId: string,
    assignmentId: string,
    answer: string,
  ): Promise<void>;

  /**
   * Function to make a join request for a class.
   *
   * @param studentId the id of the student that wants to join a class.
   * @param classCode the code of the class you want to join.
   */
  public abstract requestToJoinClass(studentId: string, classCode: string): Promise<void>;

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
  public abstract getClassStudents(classId: string): Promise<string[]>

  /**
   * Get all students for an assignment.
   * @param assignmentId 
   * @returns the id of the students
   * @throws {EntityNotFoundError} when the assignment could not be found.
   */
  public abstract getAssignmentStudents(assignmentId: string): Promise<string[]>

  /**
   * Get all students for a group.
   * @param groupId 
   * @returns the id of the students
   * @throws {EntityNotFoundError} when the group could not be found.
   */
  public abstract getGroupStudents(groupId: string): Promise<string[]>


}
