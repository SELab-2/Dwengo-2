import { GroupInterface } from "./group_interface";

export interface AssignmentInterface {
    id: string;
    uuid: string;
    start_date: Date;
    deadline: Date;
    extra_instructions: string;

    set_start_date: (new_start_date: Date) => void;
    set_deadline: (new_deadline: Date) => void;
    set_extra_instructions: (new_instructions: string) => void;

    get_groups: () => [GroupInterface];

}