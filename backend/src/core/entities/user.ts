export class User {
    
    // Necessary variables
    email: string;          // Teacher's email
    first_name: string;     // Teacher's first name
    family_name: string;    // Teacher's family name
    password_hash: string;  // Teacher's hashed password

    // Optional variables
    name_school?: string;   // Teacher's school
    id?: string;            // Teacher id

    constructor(
        email: string, 
        first_name: string, 
        family_name: string, 
        password_hash: string, 
        name_school?: string,
        id?: string
    ) {
        this.email = email;
        this.first_name = first_name;
        this.family_name = family_name;
        this.password_hash = password_hash;
        this.name_school = name_school;
        this.id = id;
    }

}