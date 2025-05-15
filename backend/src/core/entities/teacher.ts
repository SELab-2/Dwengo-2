import { User, UserType } from "./user";

export class Teacher extends User {
    public constructor(
        email: string,
        firstName: string,
        familyName: string,
        passwordHash: string,
        schoolName: string,
        id?: string,
    ) {
        super(email, firstName, familyName, passwordHash, schoolName, UserType.TEACHER, id);
    }
}
