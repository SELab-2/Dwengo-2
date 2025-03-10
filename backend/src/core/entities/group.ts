export class Group {
    constructor(
        private readonly _classId: string,
        private _members: string[],
        private readonly _id?: string,
    ) {}

    public get classId(): string {
        return this._classId;
    }

    public get members(): string[] {
        return [...this._members];  // Prevent direct modification
    }

    public get id(): string | undefined {
        return this._id;
    }

    public set members(newMembers: string[]) {
        this._members = newMembers;
    }
}