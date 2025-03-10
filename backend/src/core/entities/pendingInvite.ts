
export class PendingInvite {
    public constructor(
        private readonly _requestId: string,
        private readonly _classId: string,
    ){}

    public get requestId(): string {
        return this._requestId;
    }

    public get classId(): string {
        return this._classId;
    }
}