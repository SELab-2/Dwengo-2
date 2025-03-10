import { Class } from "../../entities/class";
import { ClassBaseUseCase } from "./baseClassUseCase";

export class CreateClass extends ClassBaseUseCase<Class, Class> {

  /**
   * Creates a database entry for a newly made class.
   * @param input the class object without an id.
   * @returns the class object with the id set.
   * @throws {DatabaseError} when the creation was failed.
   */
  async execute(input: Class): Promise<Class> {
    return this.classRepository.createClass(input);
  }
}