export interface TeacherInterface {
    // Necessary variables
    id: string;     // Teacher id
    email: string;  // Teacher's email
    first_name: string;     // Teacher's first name
    family_name: string;    // Teacher's family name
    password_hash: string;  // Teacher's hashed password

    // Optional variables
    name_school?: string;   // Teacher's school
}
