import { ClassBaseService } from "./baseClassService";
import { ServiceParams } from "../../../config/service";

export class GetClassParams implements ServiceParams {
    // fields may be null: GetClassParams for GetClassByName only requires name, GetClassByClassId only requires classId...
    constructor(
        private _classId?: string,
        private _className?: string,
        private _id?: string,
    ) {}

    public get classId(): string | undefined {
        return this._classId;
    }

    public get className(): string | undefined {
        return this._className;
    }

    // This is the ID needed for GetClassByStudent or Teacher
    public get id(): string | undefined {
        return this._id;
    }
}

export class GetClassByClassId extends ClassBaseService<GetClassParams> {
    /**
     * Gets a class from the DB given its ID.
     * @param input ID of the class to get from the DB.
     * @returns the class with the given id.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return (await this.classRepository.getClassById(input.classId!)).toObject();
    }
}

export class GetClassByName extends ClassBaseService<GetClassParams> {
    /**
     * Gets a class from the DB given its name.
     * @param input name of the class to get.
     * @returns the class with the given name.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return (await this.classRepository.getClassByName(input.className!)).toObject();
    }
}

export class GetAllClasses extends ClassBaseService<GetClassParams> {
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(): Promise<object> {
        return { classes: (await this.classRepository.getAllClasses()).forEach(c => c.toObject()) };
    }
}

export class GetUserClasses extends ClassBaseService<GetClassParams> {
    /**
     * Get all classes for a user.
     * @param input the id of the user.
     * @returns every class for a user.
     * @throws {EntityNotFoundError} if the user could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return { classes: (await this.classRepository.getUserClasses(input.id!)).forEach(c => c.toObject()) };
    }
}

export class GetClassesByTeacherId extends ClassBaseService<GetClassParams> {
    /**
     * Get all classes for a teacher.
     * @param input the id of the teacher.
     * @returns every class for a teacher.
     * @throws {EntityNotFoundError} if the teacher could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return { classes: (await this.classRepository.getAllClassesByTeacherId(input.id!)).forEach(c => c.toObject()) };
    }
}

export class GetClassesByStudentId extends ClassBaseService<GetClassParams> {
    /**
     * Get all classes for a student.
     * @param input the id of the student.
     * @returns every class where a student is part of.
     * @throws {EntityNotFoundError} if the student could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return { classes: (await this.classRepository.getAllClassesByStudentId(input.id!)).forEach(c => c.toObject()) };
    }
}
