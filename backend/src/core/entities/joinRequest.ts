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

    // Getter and Setter for requester
    public getRequester(): string {
        return this.requester;
    }

    public setRequester(requester: string): void {
        this.requester = requester;
    }

    // Getter and Setter for classId
    public getClassId(): string {
        return this.classId;
    }

    public setClassId(classId: string): void {
        this.classId = classId;
    }

    // Getter and Setter for type
    public getType(): JoinRequestType {
        return this.type;
    }

    public setType(type: JoinRequestType): void {
        this.type = type;
    }

    // Getter and Setter for id
    public getId(): string | undefined {
        return this.id;
    }

    public setId(id: string | undefined): void {
        this.id = id;
    }
    
}
