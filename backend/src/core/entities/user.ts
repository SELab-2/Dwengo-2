export abstract class User {
    constructor(
        protected readonly _email: string,
        protected _firstName: string,
        protected _familyName: string,
        protected readonly _passwordHash: string,
        protected _schoolName: string,
        protected _id?: string
    ) {}
    
    // Getters
    public get id(): string | undefined {
        return this._id;
    }
    public get email(): string {
        return this._email;
    }
    public get firstName(): string {
        return this._firstName;
    }
    public get familyName(): string {
        return this._familyName;
    }
    public get passwordHash(): string {
        return this._passwordHash;
    }
    public get schoolName(): string {
        return this._schoolName
    }

    // Setters
    public set firstName(value: string) {
        if (!value.trim()) {
            throw new Error("First name cannot be empty.");
        }
        this._firstName = value;
    }

    public set familyName(value: string) {
        if (!value.trim()) {
            throw new Error("Family name cannot be empty.");
        }
        this._familyName = value;
    }

    public set schoolName(value: string) {
        this._schoolName = value;
    }
    
}