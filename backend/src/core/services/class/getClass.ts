import { ServiceParams } from "../../../config/service";
import { ClassBaseService } from "./baseClassService";


export class GetClassParams implements ServiceParams {
    // fields may be null: GetClassParams for GetClassByName only requires name, GetClassByClassId only requires classId...
    constructor(private _classId?: string, private _className?: string, private _teacherId?: string, private _studentId?: string) {}

    public get classId(): string|undefined {
        return this._classId;
    }

    public get className(): string|undefined {
        return this._className;
    }

    public get teacherId(): string|undefined {
        return this._teacherId;
    }

    public get studentId(): string|undefined {
        return this._studentId;
    }
}

export class GetClassByClassId extends ClassBaseService<GetClassParams> {
  /**
   * Gets a class from the DB given its ID.
   * @param input ID of the class to get from the DB.
   * @returns the class with the given id.
   * @throws {EntityNotFoundError} if the class could not be found.
   */
  execute(input: GetClassParams): Promise<object> {
    return this.classRepository.getClassById(input.classId!);
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

export class GetAllClasses extends ClassBaseService<GetClassParams>{
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(): Promise<object> {
        return {classes: (await this.classRepository.getAllClasses()).forEach(c => c.toObject())};
    }
}

export class GetClassesByTeacherId extends ClassBaseService<GetClassParams>{
    /**
     * Get all classes for a teacher.
     * @param input the id of the teacher.
     * @returns every class for a teacher.
     * @throws {EntityNotFoundError} if the teacher could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return {classes: (await this.classRepository.getAllClassesByTeacherId(input.teacherId!)).forEach(c => c.toObject())};
    }
}

export class GetClassesByStudentId extends ClassBaseService<GetClassParams>{
    /**
     * Get all classes for a student.
     * @param input the id of the student.
     * @returns every class where a student is part of.
     * @throws {EntityNotFoundError} if the student could not be found.
     */
    async execute(input: GetClassParams): Promise<object> {
        return {classes: (await this.classRepository.getAllClassesByStudentId(input.teacherId!)).forEach(c => c.toObject())};
    }
}