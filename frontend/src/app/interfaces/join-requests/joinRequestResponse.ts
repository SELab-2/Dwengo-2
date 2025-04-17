/**
 * A join request from a GET to the endpoint /requests/id
 */
export interface JoinRequestResponse {
    id: string,
    requester: string,  // id
    classId: string,      // id
    type: string
}
