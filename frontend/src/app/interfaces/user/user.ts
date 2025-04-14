export enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    familyName: string;
    schoolName: string;
    passwordHash: string;
}
