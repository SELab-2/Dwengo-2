import { ClassInterface } from "./classInterface";

export interface IUser {
    // Necessary variables
    id?: string;             // User's id
    email: string;          // User's email
    first_name: string;     // User's first name
    family_name: string;    // User's family name
    password_hash: string;  // User's hashed password
}