import { Class } from "../../entities/class";
import { ClassBaseUseCase } from "./baseClassUseCase";

export class CreateClass extends ClassBaseUseCase<Class, Class> {

  async execute(input: Class): Promise<Class> {
    return this.classRepository.createClass(input);
  }
}