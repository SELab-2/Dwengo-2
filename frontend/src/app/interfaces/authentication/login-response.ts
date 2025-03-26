/**
 * Interface for the response of a login request.
 * Based on the curl request in our internal communication channels
 * TODO: update this to match the documentation
 */
export interface LoginResponse {
    token: string,
    userId: string,
    message: string,
}
