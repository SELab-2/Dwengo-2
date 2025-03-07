import { User } from "./user";

export class Teacher extends User {

    constructor(
        email: string, 
        first_name: string, 
        last_name: string, 
        password_hash: string, 
        name_school?: string,
        id?: string
    ) {
        super(
            email,
            first_name,
            last_name,
            password_hash,
            name_school,
            id
        );
    }
    
}
