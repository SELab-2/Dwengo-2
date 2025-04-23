import { Assignment } from "../assignment";
import { User } from "../user";

// TODO: just rename to Group?
export interface GroupFilledIn {
    id: string,
    assignment: Assignment,
    members: User[]
}
