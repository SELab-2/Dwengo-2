export class ThreadQuestion {
    constructor(
        private readonly _senderId: string,
        private readonly _createdAt: Date,
        private readonly _threadId: string,
        private _content: string,
    ){}

    // Getters
    public get senderId(): string {
        return this._senderId;
    }
    public get createdAt(): Date {
        return this._createdAt;
    }
    public get threadId(): string {
        return this._threadId;
    }
    public get content(): string {
        return this._content;
    }

    // Setter
    public set content(newContent: string) {
        this._content = newContent;
    }
}