export class Assignment {
    public constructor(
        private _classId: string,
        private _LearningPathId: string,
        private _start_date: Date,
        private _deadline: Date,
        private _extra_instructions: string,
        private _id?: string,
    ){}

    // Getters
    public get id():string|undefined{
        return this._id;
    }
    public get classId():string{
        return this._classId;
    }
    public get LearningPathId():string{
        return this._LearningPathId;
    }
    public get start_date():Date{
        return this._start_date;
    }
    public get deadline():Date{
        return this._deadline;
    }
    public get extra_instructions():string{
        return this._extra_instructions;
    }

    // Setters
    public set id(newId:string){
        this._id = newId;
    }
    public set classId(newClassId:string){
        this._classId = newClassId;
    }
    public set LearningPathId(newLearningPathId:string){
        this._LearningPathId = newLearningPathId;
    }
    public set start_date(newStartDate:Date){
        this._start_date = newStartDate;
    }
    public set deadline(newDeadline:Date){
        this._deadline = newDeadline;
    }
    public set extra_instructions(newExtraInstructions:string){
        this._extra_instructions = newExtraInstructions;
    }
}