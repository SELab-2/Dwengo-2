import { UserType } from "../user"

/**
 * Interface for the body of a register request.
 * Based on the Zod schema `createUserSchema` in the backend
 */
export interface UserRegistration {
    email: string,
    firstName: string,
    familyName: string,
    schoolName: string,
    password: string,
    userType: UserType
}
