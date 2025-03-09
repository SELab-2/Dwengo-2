import { Student } from "./student";
import { Class } from "./class";


export class Group {
    constructor(
        public students: Student[], // The students that are part of the group.
        public class_: Class, // The class of which the group is a subgroup of.
        public id?: string, // The unique identifier of the group.
    ){}
}

