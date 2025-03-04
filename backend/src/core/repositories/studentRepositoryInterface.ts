/*Here comes the interface for the repository for User entity -> Get's implemented in infrastructure/repositories*/

import { ClassInterface } from "../entities/classInterface";
import { Student } from "../entities/student";


export interface StudentRepositoryInterface {
    /**
     * Function to get the student with the given id.
     * 
     * @param studentId the id of the student to get.
     * @returns the student with the given id or null if student is not in DB.
     */
    getStudent(studentId: string): Promise<Student | null>;

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
    getClasses: (studentId: string) => Promise<ClassInterface[]>;
}