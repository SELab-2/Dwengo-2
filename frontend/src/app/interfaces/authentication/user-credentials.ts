/**
 * Interface representing user credentials.
 * It contains the user ID and authentication token.
 * This interface is used to manage user authentication and authorization.
 */
export interface UserCredentials {
    userId: string | null;
    token: string | null;
}
