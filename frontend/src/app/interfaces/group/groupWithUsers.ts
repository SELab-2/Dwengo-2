import { User } from "../user";

export interface GroupWithUsers {
    id: string,
    assignment: string,
    members: User[]
}
