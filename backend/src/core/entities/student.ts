import { User } from "./userInterface";

export class Student extends User {
    public constructor(
        email: string,
        first_name: string,
        last_name: string,
        password_hash: string,
        id?: string,
    ) {
        super(email, first_name, last_name, password_hash, id);
    }

}
