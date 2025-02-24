import { AssignmentInterface } from "./assignment_interface";
import { GroupInterface } from "./group_interface";
import { StudentInterface } from "./student_interface";
import { TeacherInterface } from "./teacher_interface";

export interface ClassInterface {
    id: string;
    name: string;
    year: number;
    get_assignments: () => [AssignmentInterface]; // Get the assignments for this class.
    get_all_groups: () => [GroupInterface]; // Get all existing groups that consist exclusively of students from this class.
    get_teachers: () => [TeacherInterface]; // Get this class' teachers.
    get_students: () => [StudentInterface]; // Get this class' students.
}