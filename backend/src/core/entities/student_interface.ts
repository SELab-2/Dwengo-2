import { AssignmentInterface } from "./assignment_interface";
import { UserInterface } from "./user_interface";

export interface StudentInterface extends UserInterface {
    
    /**
     * Function takes an assignment and the object (via id) on which the student wants to ask a question about.
     * 
     * @param assignment the assignment that contains the step about which the student has a question.
     * @param studentObjectId the id of the student-object.
     * @param question the actual question.
     */
    askQuestionForAssignment: (assignment: AssignmentInterface, studentObjectId: string, question: string) => Promise<void>;

    /**
     * Function will send the submission for a step in a assignment.
     * 
     * @param assignment the assignment that contains the step on which the student wants to submit their answer.
     * @param studentObjectId the id of the student-object.
     * @param string the answer provided by the student.
     */
    sendSubmissionForAssignment: (assignment: AssignmentInterface, studentObjectId: string, answer: string) => Promise<void>;

    /**
     * Fuction to make a join request for a class
     * 
     * @param classCode the code of the class you want to join
     */
    requestToJoinClass: (classCode: string) => Promise<void>;

}