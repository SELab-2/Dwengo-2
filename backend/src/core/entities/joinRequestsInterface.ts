import { ClassInterface } from "./class_interface"
import { UserInterface } from "./user_interface";

export interface JoinRequestsInterface {
    get_class: () => ClassInterface; // Get the class that the users request to join.
    get_join_requests: () => [UserInterface]; // Get one list with both all students wanting to join and all teachers wanting to join.
    accept: (student_or_teacher: UserInterface) => void; // Accept a teacher or student (from the join request list) to enter the class.
    deny: (student_or_teacher: UserInterface) => void; // Deny a teacher or student (from the join request list) to enter the class.
}