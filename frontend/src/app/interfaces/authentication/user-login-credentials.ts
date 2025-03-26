/**
 * Interface for the body of a login request.
 * Based on the curl request in our internal communication channels
 * TODO: update this to match the documentation
 */
export interface UserLoginCredentials {
    email: string,
    password: string
}
