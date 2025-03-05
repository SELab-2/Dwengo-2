export enum JoinRequestType {
    TEACHER = "teacher",
    STUDENT = "student"
}

export class JoinRequest {

    public constructor(
        private requester: string,
        private classId: string,
        private type: JoinRequestType,
        private id?: string
    ) {}

}
