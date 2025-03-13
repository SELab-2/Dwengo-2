import { GroupService } from "./groupService";
import { ServiceParams } from "../../../config/service";
import { Group } from "../../entities/group";

export class UpdateGroupParams implements ServiceParams {
    constructor(
        private _id: string,
        private _memberIds: string[],
    ) {}

    get id(): string {
        return this._id;
    }

    get memberIds(): string[] {
        return this._memberIds;
    }
}

export class UpdateGroup extends GroupService<UpdateGroupParams> {
    async execute(input: UpdateGroupParams): Promise<object> {
        const group: Group = await this.groupRepository.getById(input.id);
        group.memberIds = input.memberIds;
        return (await this.groupRepository.update(group)).toObject();
    }
}
