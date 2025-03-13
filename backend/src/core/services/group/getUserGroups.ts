import { GroupService } from "./groupService";
import { ServiceParams } from "../../../config/service";
import { Group } from "../../entities/group";

export class GetUserGroupsParams implements ServiceParams {
    constructor(private _userId: string) {}

    get userId(): string {
        return this._userId;
    }
}

export class GetUserGroups extends GroupService<GetUserGroupsParams> {
    async execute(input: GetUserGroupsParams): Promise<object> {
        const groups: Group[] = await this.groupRepository.getByUserId(input.userId);
        return { groups: groups.map(group => group.toObject()) };
    }
}
