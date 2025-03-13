export class Message {
    constructor(
        private readonly _senderId: string,
        private readonly _createdAt: Date,
        private readonly _threadId: string,
        private _content: string,
        private readonly _id?: string,
    ) {}

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

    public get id(): string | undefined {
        return this._id;
    }

    // Setter
    public set content(newContent: string) {
        this._content = newContent;
    }

    public toObject(): object {
        return {
            senderId: this._senderId,
            createdAt: this._createdAt,
            threadId: this._threadId,
            content: this._content,
            id: this._id,
        };
    }
}
