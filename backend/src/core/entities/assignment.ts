export class Assignment {
    public constructor(
        private _classId: string,
        private _learningPathId: string,
        private _startDate: Date,
        private _deadline: Date,
        private _extraInstructions: string,
        private _id?: string,
    ) {}

    // Getters
    public get id(): string | undefined {
        return this._id;
    }
    public get classId(): string {
        return this._classId;
    }
    public get learningPathId(): string {
        return this._learningPathId;
    }
    public get startDate(): Date {
        return this._startDate;
    }
    public get deadline(): Date {
        return this._deadline;
    }
    public get extraInstructions(): string {
        return this._extraInstructions;
    }

    // Setters
    public set id(newId: string) {
        this._id = newId;
    }
    public set classId(newClassId: string) {
        this._classId = newClassId;
    }
    public set learningPathId(newLearningPathId: string) {
        this._learningPathId = newLearningPathId;
    }
    public set startDate(newStartDate: Date) {
        this._startDate = newStartDate;
    }
    public set deadline(newDeadline: Date) {
        this._deadline = newDeadline;
    }
    public set extraInstructions(newExtraInstructions: string) {
        this._extraInstructions = newExtraInstructions;
    }

    public toObject(): object {
        return {
            id: this._id,
            classId: this._classId,
            learningPathId: this._learningPathId,
            startDate: this._startDate,
            deadline: this._deadline,
            extraInstructions: this._extraInstructions,
        };
    }
}
