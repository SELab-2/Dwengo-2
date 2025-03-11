
export class Class {
    public constructor(
        private _name: string,
        private _description: string,
        private _targetAudience: string,  // Who is this class directed to (8th grade, home schooling, ...)
        private _id?: string,
    ){}

    // Getters
    public get name():string{
        return this._name;
    }
    public get description():string{
        return this._description;
    }
    public get targetAudience():string{
        return this._targetAudience;
    }
    public get id():string|undefined{
        return this._id;
    }

    // Setters
    public set name(newName:string){
        this._name = newName;
    }
    public set description(newDescription:string){
        this._description = newDescription;
    }
    public set targetAudience(newTargetAudience:string){
        this._targetAudience = newTargetAudience;
    }
    public set id(newId:string){
        this._id = newId;
    }

    public toObject():object{
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            targetAudience: this._targetAudience,
        }
    }
}