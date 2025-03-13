export class Group {
    constructor(
        private _memberIds: string[],
        private readonly _assignmentId: string,
        private readonly _id?: string,
    ) {}

    public get assignmentId(): string {
        return this._assignmentId;
    }

    public get memberIds(): string[] {
        return [...this._memberIds]; // Prevent direct modification
    }

    public get id(): string | undefined {
        return this._id;
    }

    public set memberIds(newMemberIds: string[]) {
        this._memberIds = newMemberIds;
    }

    public toObject(): object {
        return {
            id: this._id,
            memberIds: this._memberIds,
            assignmentId: this._assignmentId,
        };
    }
}
