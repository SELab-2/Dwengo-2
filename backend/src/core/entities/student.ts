import { AssignmentInterface } from "./assignment_interface";
import { ClassInterface } from "./class_interface";
import { StudentInterface } from "./student_interface";

export class Student implements StudentInterface {
    id: string;
    email: string;
    first_name: string;
    family_name: string;
    password_hash: string;

    constructor(
        id: string,
        email: string,
        first_name: string,
        family_name: string,
        password_hash: string
    ) {
        this.id = id;
        this.email = email;
        this.first_name = first_name;
        this.family_name = family_name;
        this.password_hash = password_hash;
    }

    async askQuestionForAssignment(
        assignment: AssignmentInterface,
        objectId: string,
        question: string
    ): Promise<void> {
        // TODO
        return;
    }

    async sendSubmissionForAssignment(
        assignment: AssignmentInterface,
        objectId: string,
        answer: string
    ): Promise<void> {
        // TODO
        return;
    }

    async requestToJoinClass(classCode: string): Promise<void> {
        // TODO
        return;
    }

    async getClasses(): Promise<ClassInterface[]> {
        // TODO
        return [];
    }
}
