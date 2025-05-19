export class Class {
    public constructor(
        private _name: string,
        private _description: string,
        private _targetAudience: string, // Who is this class directed to (8th grade, home schooling, ...)
        private _teacherId: string, // TODO: remove this field,
        // because in the database there is no main teacher for the class.
        // So this is actually each time a random teacher of that class, which doesnt have a lot of meaning
        private _id?: string,
    ) {}

    // Getters
    public get name(): string {
        return this._name;
    }

    public get description(): string {
        return this._description;
    }

    public get targetAudience(): string {
        return this._targetAudience;
    }

    public get teacherId(): string {
        return this._teacherId;
    }

    public get id(): string | undefined {
        return this._id;
    }

    // Setters
    public set name(newName: string) {
        this._name = newName;
    }

    public set description(newDescription: string) {
        this._description = newDescription;
    }

    public set targetAudience(newTargetAudience: string) {
        this._targetAudience = newTargetAudience;
    }

    public set teacherId(newTeacherId: string) {
        this._teacherId = newTeacherId;
    }

    public set id(newId: string) {
        this._id = newId;
    }

    public toObject(): object {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            targetAudience: this._targetAudience,
            teacherId: this.teacherId,
        };
    }
}
