import { ClassInterface } from "./class_interface";
import { TeacherInterface } from "./teacher_interface";

export class Teacher implements ITeacher {

    // Necessary variables
    id: string;     // Teacher id
    email: string;  // Teacher's email
    first_name: string;     // Teacher's first name
    family_name: string;    // Teacher's family name
    password_hash: string;  // Teacher's hashed password
    get_classes: () => [ClassInterface];
    create_class: () => ClassInterface;

    // Optional variables
    name_school?: string;   // Teacher's school

    constructor(
        id: string, 
        email: string, 
        first_name: string, 
        family_name: string, 
        password_hash: string, 
        get_classes: () => [ClassInterface],
        create_class: () => ClassInterface,
        name_school?: string) {
        this.id = id;
        this.email = email;
        this.first_name = first_name;
        this.family_name = family_name;
        this.password_hash = password_hash;
        this.name_school = name_school;
        this.get_classes = get_classes;
        this.create_class = create_class;
    }
    
}
