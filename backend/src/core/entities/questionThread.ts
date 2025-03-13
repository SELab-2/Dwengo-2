export enum VisibilityType {
    PUBLIC = "public",
    GROUP = "group",
    PRIVATE = "private",
}

export class QuestionThread {
    public constructor(
        private readonly _creatorId: string,
        private readonly _assignmentId: string,
        private readonly _learningObjectId: string,
        private _isClosed: boolean,
        private _visibility: VisibilityType,
        private _messageIds: string[],
        private _id?: string,
    ) {}

    // Getters
    public get creatorId(): string {
        return this._creatorId;
    }

    public get assignmentId(): string {
        return this._assignmentId;
    }

    public get learningObjectId(): string {
        return this._learningObjectId;
    }

    public get isClosed(): boolean {
        return this._isClosed;
    }

    public get visibility(): VisibilityType {
        return this._visibility;
    }

    public get messageIds(): string[] {
        return this._messageIds;
    }

    public get id(): string | undefined {
        return this._id;
    }

    // Setter
    public set isClosed(closed: boolean) {
        this._isClosed = closed;
    }
    
    public set visibility(newVisibility: VisibilityType) {
        this._visibility = newVisibility;
    }
    
    public set messageIds(newMessages: string[]) {
        this._messageIds = newMessages;
    }
    
    public set id(newId: string) {
        this._id = newId;
    }

    public toObject(): object {
        return {
            creatorId: this.creatorId,
            assignmentId: this.assignmentId,
            learningObjectId: this.learningObjectId,
            isClosed: this.isClosed,
            visibility: this.visibility,
            messageIds: this.messageIds,
            id: this.id,
        };
    }
}
