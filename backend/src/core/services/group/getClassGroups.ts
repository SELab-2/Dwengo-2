import { ServiceParams } from "../../../config/service";
import { GroupService } from "./groupService";
import { Group } from "../../entities/group";

export class GetClassGroupsParams implements ServiceParams {
  constructor(private _classId: string) {}

  get classId(): string {
    return this._classId;
  }
}

export class GetClassGroups extends GroupService<GetClassGroupsParams> {
  async execute(input: GetClassGroupsParams): Promise<object> {
    const groups: Group[] = await this.groupRepository.getByClassId(input.classId);
    return {groups: groups.map(group => group.toObject())};
  }
}
