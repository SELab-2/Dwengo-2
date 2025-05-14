import { ApiError, ErrorCode } from "../../application/types";

export enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
}

export class User {
    private _email: string;

    constructor(
        email: string,
        private _firstName: string,
        private _familyName: string,
        private readonly _passwordHash: string,
        private _schoolName: string,
        private _userType: UserType,
        private _id?: string,
    ) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Email invalid.",
            } as ApiError;
        }
        // Convert email to lowercase
        this._email = email.toLowerCase();
    }

    public get email(): string {
        return this._email;
    }

    // Getters
    public get id(): string | undefined {
        return this._id;
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
        return this._schoolName;
    }

    public get userType(): string {
        return this._userType;
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

    public toObject(): object {
        return {
            id: this._id,
            email: this._email,
            firstName: this._firstName,
            familyName: this._familyName,
            schoolName: this._schoolName,
            passwordHash: this._passwordHash,
        };
    }
}
