import { ServiceParams } from "../../../config/service";
import { GroupService } from "./groupService";

export class GetGroupParams implements ServiceParams {
  constructor(private _id: string) {}

  get id(): string {
    return this._id;
  }
}

export class GetGroup extends GroupService<GetGroupParams> {
  async execute(input: GetGroupParams): Promise<object> {
    return (await this.groupRepository.getById(input.id)).toObject();
  }
}
