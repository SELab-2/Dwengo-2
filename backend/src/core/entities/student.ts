import { AssignmentInterface } from "./assignmentInterface";
import { ClassInterface } from "./classInterface";
import { IStudent } from "./studentInterface";

export class Student implements IStudent {
    public constructor(
        public readonly id: string,
        public readonly email: string,
        public first_name: string,
        public family_name: string,
        public readonly password_hash: string
    ) {}

    public async askQuestionForAssignment(
        assignment: AssignmentInterface,
        objectId: string,
        question: string
    ): Promise<void> {
        // TODO
        return;
    }

    public async sendSubmissionForAssignment(
        assignment: AssignmentInterface,
        objectId: string,
        answer: string
    ): Promise<void> {
        // TODO
        return;
    }

    public async requestToJoinClass(classCode: string): Promise<void> {
        // TODO
        return;
    }

    public async getClasses(): Promise<ClassInterface[]> {
        // TODO
        return [];
    }
}
