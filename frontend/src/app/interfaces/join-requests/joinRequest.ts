import { UserType } from "../user";

export interface JoinRequest {
    id: string,
    requester: string,  // id
    class: string,      // id
    userType: UserType
}
