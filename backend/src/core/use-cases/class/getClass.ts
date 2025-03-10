import { UseCase } from "../../../config/useCase";
import { Class } from "../../entities/class";
import { IClassRepository } from "../../repositories/classRepositoryInterface";


//TODO - change after refactor


export class GetClassByClassId implements UseCase<string, Class> {
  constructor(private classRepository: IClassRepository) {}

  /**
   * Gets a class from the DB.
   * @param input ID of the class to get from the DB.
   * @returns the class with the given id.
   * @throws Error if the class could not be found.
   */
  async execute(input: string): Promise<Class> {
    return this.classRepository.getClassById(input);
  }
}