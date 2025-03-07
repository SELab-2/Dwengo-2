import { User } from "./userInterface";

export class Student extends User {
    public constructor(
        email: string,
        firstName: string,
        familyName: string,
        passwordHash: string,
        id?: string,
    ) {
        super(email, firstName, familyName, passwordHash, id);
    }

}
