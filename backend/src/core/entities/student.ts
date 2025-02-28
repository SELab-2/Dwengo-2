import { ClassInterface } from "./classInterface";
import { User } from "./userInterface";

export class Student extends User {
    public constructor(
        public readonly email: string,
        public first_name: string,
        public family_name: string,
        public readonly password_hash: string,
        public readonly id?: string,
    ) {
        super(email, first_name, family_name, password_hash, id);
    }
}
