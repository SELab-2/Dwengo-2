import { ClassInterface } from "./class_interface";

export interface TeacherInterface {
    // Necessary variables
    id: string;     // Teacher id
    email: string;  // Teacher's email
    first_name: string;     // Teacher's first name
    family_name: string;    // Teacher's family name
    password_hash: string;  // Teacher's hashed password
    get_classes: () => [ClassInterface]

    // Optional variables
    name_school?: string;   // Teacher's school
}
