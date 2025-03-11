
export enum StatusType {
    NOT_ACCEPTED = "not_accepted",
    ACCEPTED = "accepted"
}

export class Submission {
    public constructor(
        private readonly _studentId: string,
        private readonly _assignmentId: string,
        private readonly _learningObjectId: string,
        private readonly _time: Date,
        private _contents: any, // can be a photo, a string, whatever. In the database this is bytea.
        private _status: StatusType,
        private _id?: string,
    ){}

    // Getters
    public get studentId(): string {
        return this._studentId;
    }
    public get assignmentId(): string {
        return this._assignmentId;
    }
    public get learningObjectId(): string {
        return this._learningObjectId;
    }
    public get time(): Date {
        return this._time;
    }
    public get contents(): any {
        return this._contents;
    }
    public get status(): StatusType {
        return this._status;
    }
    public get id(): string|undefined {
        return this._id;
    }
    

    // Setter
    public set contents(newContents: any) {
        this._contents = newContents;
    }
    public set status(newStatus: StatusType) {
        this._status = newStatus;
    }
    public set id(newId: string) {
        this._id = newId;
    }
}