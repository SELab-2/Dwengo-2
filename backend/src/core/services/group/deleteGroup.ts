import { ServiceParams } from "../../../config/service";
import { GroupService } from "./groupService";
import { Group } from "../../entities/group";

export class DeleteGroupParams implements ServiceParams {
  constructor(private _group: Group) {}

  get group(): Group {
    return this._group;
  }
}

export class DeleteGroup extends GroupService<DeleteGroupParams> {
  async execute(input: DeleteGroupParams): Promise<object> {
    await this.groupRepository.delete(input.group);
    return {};
  }
}
