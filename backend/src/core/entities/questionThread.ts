import { Message } from "./message";
export enum VisibilityType {
    PUBLIC = "public",
    GROUP = "group",
    PRIVATE = "private"
}

export class QuestionThread {
    public constructor(
        private readonly _creatorId: string,
        private readonly _assignmentId: string,
        private readonly _learningObjectId: string,
        private _isClosed: boolean,
        private _visibility: VisibilityType,
        private _messages: Message[],
        private _Id?: string,
    ){}

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
    public get messages(): Message[] {
        return this._messages;
    }
    public get Id(): string|undefined {
        return this._Id;
    }
    

    // Setter
    public set isClosed(closed: boolean) {
        this._isClosed = closed;
    }
    public set visibility(newVisibility: VisibilityType) {
        this._visibility = newVisibility;
    }
    public set messages(newMessages: Message[]) {
        this._messages = newMessages;
    }
    public set Id(newId: string) {
        this._Id = newId;
    }
}