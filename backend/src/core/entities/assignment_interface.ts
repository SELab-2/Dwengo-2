import { GroupInterface } from "./group_interface";

export interface AssignmentInterface {
    id: string;
    get_groups: () => [GroupInterface]

}