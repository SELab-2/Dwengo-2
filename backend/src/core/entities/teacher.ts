import { ClassInterface } from "./classInterface";
import { ITeacher } from "./teacherInterface";
import { User } from "./user";

export class Teacher extends User {

    constructor(
        id: string, 
        email: string, 
        first_name: string, 
        family_name: string, 
        password_hash: string, 
        name_school?: string) {
        super(
            id,
            email,
            first_name,
            family_name,
            password_hash,
            name_school
        );
    }
    
}
