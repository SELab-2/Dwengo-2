import { ServiceParams } from "../../../config/service";
import { ClassBaseService } from "./baseClassService";

export class DeleteClassParams implements ServiceParams {
  constructor(
    private _id: string //id of the class to delete
  ){}

  public get id(): string {
    return this._id;
  }
}

export class DeleteClass extends ClassBaseService<DeleteClassParams>{

  async execute(input: DeleteClassParams): Promise<object> {
    await this.classRepository.deleteClassById(input.id);
    return {};
  }
}