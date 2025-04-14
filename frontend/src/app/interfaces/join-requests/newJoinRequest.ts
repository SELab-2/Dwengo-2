/**
 * A new join request needed in the body of the POST to /requests
 */
export interface NewJoinRequest {
    requester: string,  // The id of the user making the request
    class: string,      // The id of the class the user is requesting to join
    userType: string    // The type of the user
}
