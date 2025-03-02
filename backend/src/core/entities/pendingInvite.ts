export class PendingInvite {
    public constructor(
        private readonly requestId: string,
        private readonly classId: string,
    ){}

    public getRequestId(): string {
        return this.requestId;
    }

    public getClassId(): string {
        return this.classId;
    }
}