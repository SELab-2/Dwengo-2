import { ServiceParams } from "../../../config/service";
import { Class } from "../../entities/class";
import { ClassBaseService } from "./baseClassService";

//TODO - change after refactor
export class GetClassByClassIdParams implements ServiceParams {
    classId: string;
    className: string;
    teacherId: string;
    studentId: string;
    constructor(classId: string, className: string, teacherId: string, studentId: string) {
        this.classId = classId;
        this.className = className;
        this.teacherId = teacherId;
        this.studentId = studentId;
    }

    getClassId(): string {
        return this.classId;
    }

    getClassName(): string {
        return this.className;
    }

    getTeacherId(): string {
        return this.teacherId;
    }

    getStudentId(): string {
        return this.studentId;
    }
}

export class GetClassByClassId extends ClassBaseService<GetClassByClassIdParams, object> {
  /**
   * Gets a class from the DB given its ID.
   * @param input ID of the class to get from the DB.
   * @returns the class with the given id.
   * @throws {EntityNotFoundError} if the class could not be found.
   */
  execute(input: GetClassByClassIdParams): Promise<object> {
    return this.classRepository.getClassById(input.getClassId());
  }
}

export class GetClassByName extends ClassBaseService<GetClassByClassIdParams, object> {
    /**
     * Gets a class from the DB given its name.
     * @param input name of the class to get.
     * @returns the class with the given name.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: GetClassByClassIdParams): Promise<object> {
        return this.classRepository.getClassByName(input.getClassName());
    }
}

export class GetAllClasses extends ClassBaseService<GetClassByClassIdParams, object>{
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(): Promise<object> {
        return this.classRepository.getAllClasses();
    }
}

export class GetClassesByTeacherId extends ClassBaseService<GetClassByClassIdParams, object>{
    /**
     * Get all classes for a teacher.
     * @param input the id of the teacher.
     * @returns every class for a teacher.
     * @throws {EntityNotFoundError} if the teacher could not be found.
     */
    async execute(input: GetClassByClassIdParams): Promise<object> {
        return this.classRepository.getAllClassesByTeacherId(input.getTeacherId());
    }
}

export class GetClassesByStudentId extends ClassBaseService<GetClassByClassIdParams, object>{
    /**
     * Get all classes for a student.
     * @param input the id of the student.
     * @returns every class where a student is part of.
     * @throws {EntityNotFoundError} if the student could not be found.
     */
    async execute(input: GetClassByClassIdParams): Promise<object> {
        return this.classRepository.getAllClassesByStudentId(input.getStudentId());
    }
}