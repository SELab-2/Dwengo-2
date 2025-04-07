import { User, UserType } from "../user";

export interface JoinRequestWithUser {
    id: string,
    requester: User,
    class: string,      // id
    userType: UserType
}
