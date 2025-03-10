/*Here comes the interface for the repository for User entity -> Get's implemented in infrastructure/repositories*/

import { Class } from "../entities/class";
import { Student } from "../entities/student";

export interface IStudentRepository {

    /**
     * Function to delete a student record in the DB.
     * 
     * @param student the student to delete.
     */
    deleteStudent(student: string): Promise<void>;

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
    removeStudentFromClass(studentId: string, classId: string): Promise<void>;

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
    removeStudentFromGroup(studentId: string, groupId: string): Promise<void>;
    /**
     * Function to update a student's info in the DB.
     * 
     * @param student the student object with info to be updated.
     * @returns void
     * @throws Error if the student is not present in the DB.
     */
    updateStudent(student: Student): Promise<void>;

    /**
     * Function to get the student with the given id.
     * 
     * @param studentId the id of the student to get.
     * @returns the student with the given id.
     * @throws Error if the student is not found.
     */
    getStudent(studentId: string): Promise<Student>;

    /**
     * Create a new student in the DB.
     * @param student the student to be created
     * @returns the id of the created student in the DB.
     * @throws Error if the student could not be created.
     */
    createStudent(
        student: Student
    ): Promise<string>;

    /**
     * Find a student in the DB by email.
     * @param email email of the student to be found
     * @returns true if the student is present in the DB, false otherwise.
     */
    findByEmail(
        email: string
    ): Promise<boolean>;

    /**
     * Ask a question about a step in an assignment.
     * @param studentId the id of the student asking the question.
     * @param assignmentId the assignment which contains the step.
     * @param objectId specifies the object which is the subject of the question.
     * @param question the question itself.
     */
    askQuestionForAssignment(
        studentId: string,
        assignmentId: string,
        objectId: string,
        question: string
    ): Promise<void>;

    /**
     * Function will send the submission for a step in a assignment.
     * 
     * @param studentId the id of the student submitting a step in a assignment.
     * @param assignmentID the assignment that contains the step on which the student wants to submit their answer.
     * @param objectId the id of the object.
     * @param answer the answer provided by the student.
     */
    sendSubmissionForAssignment(
        studentId: string,
        objectId: string,
        assignmentId: string,
        answer: string
    ): Promise<void>;

    /**
     * Function to make a join request for a class.
     * 
     * @param studentId the id of the student that wants to join a class.
     * @param classCode the code of the class you want to join.
     */
    requestToJoinClass(studentId: string, classCode: string): Promise<void>;

     /**
     * Get every class where the student is part of.
     * @param studentId the student id.
     * @returns every class where the student is part of
     */
    getClasses: (studentId: string) => Promise<Class[]>;
}
