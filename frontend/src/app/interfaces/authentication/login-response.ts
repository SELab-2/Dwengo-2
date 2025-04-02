/**
 * Interface for the response of a login request.
 * Based on the curl request in our internal communication channels
 */
export interface LoginResponse {
    token: string,
    refreshToken: string,
    id: string,
    message: string,
    refreshToken: string,
}
