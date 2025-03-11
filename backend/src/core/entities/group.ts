
export class Group {
    constructor(
        private readonly _classId: string,
        private _memberIds: string[],
        private readonly _id?: string,
    ) {}

    public get classId(): string {
        return this._classId;
    }

    public get memberIds(): string[] {
        return [...this._memberIds];  // Prevent direct modification
    }

    public get id(): string | undefined {
        return this._id;
    }

    public set memberIds(newMemberIds: string[]) {
        this._memberIds = newMemberIds;
    }
}

