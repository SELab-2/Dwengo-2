export class PendingInvite {
    public constructor(
        private requestId: string,
        private classId: string,
        private inviteId?: string,
    ){}

    public getRequestId(): string {
        return this.requestId;
    }
    public setRequestId(requestId: string) {
        this.requestId = requestId;
    }

    public getClassId(): string {
        return this.classId;
    }
    public setClassId(classId: string) {
        this.classId = classId;
    }

    public getInviteId(): string | undefined {
        return this.inviteId;
    }
    public setInviteId(inviteId: string) {
        this.inviteId = inviteId;
    }
}