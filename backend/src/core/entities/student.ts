import { ClassInterface } from "./classInterface";
import { IStudent } from "./studentInterface";

export class Student implements IStudent {
    public constructor(
        public readonly email: string,
        public first_name: string,
        public family_name: string,
        public readonly password_hash: string,
        public classes: ClassInterface[],
        public readonly id?: string,
    ) {}
}
