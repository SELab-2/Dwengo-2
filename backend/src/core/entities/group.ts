import { Student } from "./student";
import { Class } from "./class";


export class Group {
    constructor(
        public student_ids: string[], // The students that are part of the group.
        public class_id: string, // The class of which the group is a subgroup of.
        public id?: string, // The unique identifier of the group.
    ){}
}

