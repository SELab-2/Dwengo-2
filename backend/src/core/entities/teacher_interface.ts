import { ClassInterface } from "./class_interface";
import { UserInterface } from "./user_interface";

export interface TeacherInterface extends UserInterface{
    // Optional variables
    name_school?: string;   // Teacher's school

    create_class: () => ClassInterface;
}
