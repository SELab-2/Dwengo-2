import { ServiceParams } from "../../../config/service";
import { ClassBaseService } from "./baseClassService";
import { Class } from "../../entities/class";

export class UpdateClassParams implements ServiceParams {
  constructor(
    private _id: string,
    private _name?: string,
    private _description?: string,
    private _targetAudience?: string
  ) { }

  public get id(): string {
    return this._id;
  }
  public get name(): string | undefined {
    return this._name;
  }
  public get description(): string | undefined {
    return this._description;
  }
  public get targetAudience(): string | undefined {
    return this._targetAudience;
  }
}

export class UpdateClass extends ClassBaseService<UpdateClassParams> {
  async execute(input: UpdateClassParams): Promise<Class> {

    // Object met alleen de velden die worden bijgewerkt
    const updatedFields: Partial<Class> = {};
    if (input.name) updatedFields.name = input.name;
    if (input.description) updatedFields.description = input.description;
    if (input.targetAudience) updatedFields.targetAudience = input.targetAudience;

    return this.classRepository.updateClass(input.id, updatedFields);
  }
}
