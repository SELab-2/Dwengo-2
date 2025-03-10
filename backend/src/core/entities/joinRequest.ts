import { Entity } from "./entityInterface";

export enum JoinRequestType {
    TEACHER = "teacher",
    STUDENT = "student"
}

export class JoinRequest implements Entity {
    public constructor(
        private _requester: string,
        private _classId: string,
        private _type: JoinRequestType,
        private _id?: string,
    ){}

    //getters
    public get requester(): string {
        return this._requester;
    }
    public get classId(): string {
        return this._classId;
    }
    public get type(): JoinRequestType {
        return this._type;
    }
    public get id(): string | undefined {
        return this._id;
    }

    //setters
    public set requester(newRequester: string) {
        this._requester = newRequester;
    }
    public set classId(newClassId: string) {
        this._classId = newClassId;
    }
    public set type(newType: JoinRequestType) {
        this._type = newType;
    }
    public set id(newId: string) {
        this._id = newId;
    }
}
