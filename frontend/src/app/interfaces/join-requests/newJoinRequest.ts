/**
 * A new join request needed in the body of the POST to /requests
 */
export interface NewJoinRequest {
    requester: string,  // The id of the user making the request
    code: string,      // The class code
    userType: string    // The type of the user
}
