export class PendingInvite {
    public constructor(
        private readonly requestId: string,
        private readonly classId: string,
        private inviteId?: string,
    ){}

    public getRequestId(): string {
        return this.requestId;
    }

    public getClassId(): string {
        return this.classId;
    }

    public getInviteId(): string | undefined {
        return this.inviteId;
    }
    public setInviteId(inviteId: string) {
        this.inviteId = inviteId;
    }
}