import { User, UserType } from "../user";

export interface JoinRequestWithUser {
    id: string,
    requester: User,    // User filled in instead of id
    class: string,      // id
    userType: UserType
}
