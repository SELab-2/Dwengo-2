import { ServiceParams } from "../../../config/service";
import { ClassBaseService } from "./baseClassService";
import { Class } from "../../entities/class";

export class CreateClassParams implements ServiceParams {
  constructor(
    private _name: string,
    private _description: string,
    private _targetAudience: string
  ) {}

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get targetAudience(): string {
    return this._targetAudience;
  }
}

export class CreateClass extends ClassBaseService<CreateClassParams> {
  async execute(input: CreateClassParams): Promise<Class> {
    const newClass = new Class(input.name, input.description, input.targetAudience);
    return this.classRepository.createClass(newClass);
  }
}