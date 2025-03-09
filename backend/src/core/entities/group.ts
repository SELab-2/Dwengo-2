import { Student } from './student';

export class Group {
    constructor(
        private readonly _classId: string,
        private _members: Student[],
        private readonly _id?: string,
    ) {}

    public get classId(): string {
        return this._classId;
    }

    public get members(): Student[] {
        return [...this._members];  // Prevent direct modification
    }

    public get id(): string | undefined {
        return this._id;
    }

    public addMember(student: Student): void {
        if (!this._members.some(m => m.id === student.id)) {
            this._members.push(student);
        }
    }

    public removeMember(studentId: string): void {
        this._members = this._members.filter(m => m.id !== studentId);
    }
}