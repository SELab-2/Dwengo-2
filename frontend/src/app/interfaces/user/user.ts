export enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
}

/**
 * A user, as represented by the API
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    familyName: string;
    schoolName: string;
    passwordHash: string;
}

export interface UsersResponse {
    students: string[];
}