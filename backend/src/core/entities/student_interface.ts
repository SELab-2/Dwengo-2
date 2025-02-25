import { AssignmentInterface } from "./assignment_interface";
import { UserInterface } from "./user_interface";

export interface StudentInterface extends UserInterface {
    ask_question_for_assignment: (assignment: AssignmentInterface) => void; // TODO: correct arguments.
    send_submission_for_assignment: (assignment: AssignmentInterface) => void;
}