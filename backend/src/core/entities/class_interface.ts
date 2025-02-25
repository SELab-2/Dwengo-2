import { AssignmentInterface } from "./assignment_interface";
import { GroupInterface } from "./group_interface";
import { StudentInterface } from "./student_interface";
import { TeacherInterface } from "./teacher_interface";

export interface ClassInterface {
    id: string;
    name: string;
    year: number;

    set_year: (new_year: number) => void;
    set_name: (new_name: string) => void;

    get_teachers: () => [TeacherInterface]; // Get this class' teachers.
    get_students: () => [StudentInterface]; // Get this class' students.
    create_invite_link: () => string; // Create an invite link for teachers and students to join the class.

    get_assignments: () => [AssignmentInterface]; // Get the assignments for this class.
    create_assignment: () => AssignmentInterface; // Create a new assignment.

    get_all_groups: () => [GroupInterface]; // Get all existing groups that consist exclusively of students from this class.

}