/**
 * Response body from a GET to /groups/{id}
 */
export interface GroupResponse {
    id: string,
    assignment: string,
    members: string[]
}
