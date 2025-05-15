import { TaskDetails, TaskType } from "../../config/taskTypes";

export class Task {
    public constructor(
        private _assignmentId: string,
        private _step: number,
        private _question: string,
        private _type: TaskType,
        private _details: TaskDetails,
        private _id?: string
    ) {}

    public get id(): string | undefined {
        return this._id;
    }

    public get assignmentId(): string {
        return this._assignmentId;
    }
    public set assignmentId(value: string) {
        this._assignmentId = value;
    }

    public get step(): number {
        return this._step;
    }
    public set step(value: number) {
        this._step = value;
    }

    public get question(): string {
        return this._question;
    }
    public set question(value: string) {
        this._question = value;
    }

    public get type(): TaskType {
        return this._type;
    }
    public set type(value: TaskType) {
        this._type = value;
    }

    public get details(): TaskDetails {
        return this._details;
    }
    public set details(value: TaskDetails) {
        this._details = value;
    }

    public toObject(): object {
        return {
            id: this._id,
            assignmentId: this._assignmentId,
            step: this._step,
            question: this._question,
            type: this._type,
            ...this._details
        };
    }
}