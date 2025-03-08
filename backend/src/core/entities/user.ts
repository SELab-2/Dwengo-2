export class User {
    
    // Necessary variables
    email: string;          // Teacher's email
    firstName: string;     // Teacher's first name
    familyName: string;    // Teacher's family name
    passwordHash: string;  // Teacher's hashed password

    // Optional variables
    nameSchool?: string;   // Teacher's school
    id?: string;            // Teacher id

    constructor(
        email: string, 
        firstName: string, 
        familyName: string, 
        passwordHash: string, 
        nameSchool?: string,
        id?: string
    ) {
        this.email = email;
        this.firstName = firstName;
        this.familyName = familyName;
        this.passwordHash = passwordHash;
        this.nameSchool = nameSchool;
        this.id = id;
    }

}