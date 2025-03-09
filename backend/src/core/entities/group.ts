import { Student } from "./student";
import { Class } from "./class";


export class Group {
    constructor(
        protected students: Student[], // The students that are part of the group.
        protected class_: Class // The class of which the group is a subgroup of.
    ){}
}

