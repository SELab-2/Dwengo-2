import { User } from "../user";

/**
 * Like JoinRequestResponse but with the requester filled in
 * with the User object corresponding to the requester id
 */
export interface JoinRequestWithUser {
    id: string,
    requester: User,    // User filled in instead of id
    classId: string,      // id
    userType: string
}
