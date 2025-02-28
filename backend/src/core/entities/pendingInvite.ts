export class PendingInvite {
    public constructor(
        public requestId: string,
        public classId: string,
        public inviteId?: string,
    ){}
}