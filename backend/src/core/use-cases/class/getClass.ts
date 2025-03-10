import { EntityNotFoundError } from "../../../config/error";
import { Class } from "../../entities/class";
import { ClassBaseUseCase } from "./baseClassUseCase";

//TODO - change after refactor

export class GetClassByClassId extends ClassBaseUseCase<string, Class> {
  /**
   * Gets a class from the DB given its ID.
   * @param input ID of the class to get from the DB.
   * @returns the class with the given id.
   * @throws {EntityNotFoundError} if the class could not be found.
   */
  execute(input: string): Promise<Class> {
    return this.classRepository.getClassById(input);
  }
}

export class GetClassByName extends ClassBaseUseCase<string, Class> {
    /**
     * Gets a class from the DB given its name.
     * @param input name of the class to get.
     * @returns the class with the given name.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(input: string): Promise<Class> {
        return this.classRepository.getClassByName(input);
    }
}

export class GetAllClasses extends ClassBaseUseCase<void, Class[]>{
    /**
     * Get all classes,
     * @returns every class stored inside the database.
     * @throws {EntityNotFoundError} if the class could not be found.
     */
    async execute(): Promise<Class[]> {
        return this.classRepository.getAllClasses();
    }
}

export class GetClassesByTeacherId extends ClassBaseUseCase<string, Class[]>{
    /**
     * Get all classes for a teacher.
     * @param input the id of the teacher.
     * @returns every class for a teacher.
     * @throws {EntityNotFoundError} if the teacher could not be found.
     */
    async execute(input: string): Promise<Class[]> {
        return this.classRepository.getAllClassesByTeacherId(input);
    }
}

export class GetClassesByStudentId extends ClassBaseUseCase<string, Class[]>{
    /**
     * Get all classes for a student.
     * @param input the id of the student.
     * @returns every class where a student is part of.
     * @throws {EntityNotFoundError} if the student could not be found.
     */
    async execute(input: string): Promise<Class[]> {
        return this.classRepository.getAllClassesByStudentId(input);
    }
}