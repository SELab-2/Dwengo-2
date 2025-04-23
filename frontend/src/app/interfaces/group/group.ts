import { Assignment } from "../assignment";
import { User } from "../user";

export interface Group {
    id: string,
    assignment: Assignment,
    members: User[]
}
