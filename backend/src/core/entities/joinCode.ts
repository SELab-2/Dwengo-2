export class JoinCode {
    public constructor(
        private _classId: string,
        private _createdAt?: Date,
        private _code?: string,
        private _isExpired?: boolean,
    ) {}

    // Getters
    public get classId(): string {
        return this._classId;
    }

    public get createdAt(): Date | undefined {
        return this._createdAt;
    }

    public get code(): string | undefined {
        return this._code;
    }

    public get isExpired(): boolean | undefined {
        return this._isExpired;
    }

    // Setters
    public set classId(newClassId: string) {
        this._classId = newClassId;
    }

    public set createdAt(newCreatedAt: Date) {
        this._createdAt = newCreatedAt;
    }

    public set code(newCode: string) {
        this._code = newCode;
    }

    public set isExpired(newIsExpired: boolean) {
        this._isExpired = newIsExpired;
    }

    public toObject(): object {
        return {
            classId: this._classId,
            createdAt: this._createdAt,
            code: this._code,
            expired: this._isExpired,
        };
    }
}
