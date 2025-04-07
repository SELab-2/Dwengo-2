import { UserType } from "../user";

export interface JoinRequestResponse {
    id: string,
    requester: string,  // id
    class: string,      // id
    userType: string
}
