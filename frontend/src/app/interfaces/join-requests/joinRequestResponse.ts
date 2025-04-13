import { UserType } from "../user";

export interface JoinRequestResponse {
    id: string,
    requester: string,  // id
    classId: string,      // id
    type: string
}
