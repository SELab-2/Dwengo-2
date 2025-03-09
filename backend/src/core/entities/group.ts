export class Group {
    public constructor(
        private _classId: string,
        private _members: string[], // List of student IDs
        private _id?: string,
    ){}

    // Getters
    public get classId():string{
        return this._classId;
    }
    public get members():string[]{
        return this._members;
    }
    public get id():string|undefined{
        return this._id;
    }

    // Setters
    public set classId(newClassId:string){
        this._classId = newClassId;
    }
    public set members(newMembers:string[]){
        this._members = newMembers;
    }
    public set id(newId:string){
        this._id = newId;
    }
}