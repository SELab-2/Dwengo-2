import { User } from "./userInterface";

export class Student extends User {
    public constructor(
        email: string,
        firstName: string,
        familyName: string,
        passwordHash: string,
        id?: string,
    ) {
        super(email, firstName, familyName, passwordHash, id);
    }

    public get classes():string[]{
        return this._classes; // Mutable
    }
    
    public get classesCopy():string[]{
        return [...this._classes]; // Immutable for instance
    }

    public set classes(newClasses:string[]){
        if (!Array.isArray(newClasses)) {
            throw new Error("Classes must be an array of strings.");
        }
        this._classes = newClasses;
    }
}
