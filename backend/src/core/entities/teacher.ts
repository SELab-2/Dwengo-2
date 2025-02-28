import { ClassInterface } from "./classInterface";
import { ITeacher } from "./teacherInterface";
import { User } from "./user";

export class Teacher extends User {

    constructor(
        email: string, 
        first_name: string, 
        family_name: string, 
        password_hash: string, 
        name_school?: string,
        id?: string
    ) {
        super(
            email,
            first_name,
            family_name,
            password_hash,
            name_school,
            id
        );
    }
    
}
