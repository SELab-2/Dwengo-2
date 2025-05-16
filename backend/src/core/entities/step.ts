export enum StepType {
    MULTIPLE_CHOICE = "multiple_choice",
    OPEN_QUESTION = "open_question",
}

export class Step {
    public constructor(
        private _assignmentId: string,
        private _learningObjectId: string,
        private _type: StepType,
        private _form: string,
        private _id?: string,
    ) {}

    // Getters
    public get assignmentId(): string {
        return this._assignmentId;
    }

    public get learningObjectId(): string {
        return this._learningObjectId;
    }

    public get form(): string {
        return this._form;
    }

    public get type(): StepType {
        return this._type;
    }

    public get id(): string | undefined {
        return this._id;
    }

    // Setter
    public set assignmentId(newAssignmentId: string) {
        this._assignmentId = newAssignmentId;
    }

    public set learningObjectId(learningObjectId: string) {
        this._learningObjectId = learningObjectId;
    }

    public set type(newStatus: StepType) {
        this._type = newStatus;
    }

    public set form(newForm: string) {
        this._form = newForm;
    }

    public set id(newId: string) {
        this._id = newId;
    }

    public toObject(): object {
        return {
            assignmentId: this._assignmentId,
            learningObjectId: this._learningObjectId,
            type: this._type,
            form: this._form,
            id: this._id,
        };
    }
}
