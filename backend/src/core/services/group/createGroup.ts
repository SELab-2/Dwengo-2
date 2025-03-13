import { GroupService } from "./groupService";
import { ServiceParams } from "../../../config/service";
import { Group } from "../../entities/group";

export class CreateGroupParams implements ServiceParams {
    constructor(
        private _memberIds: string[],
        private _classId: string,
    ) {}

    get memberIds(): string[] {
        return this._memberIds;
    }

    get classId(): string {
        return this._classId;
    }
}

export class CreateGroup extends GroupService<CreateGroupParams> {
    async execute(input: CreateGroupParams): Promise<object> {
        const newGroup = new Group(input.memberIds, input.classId);
        return { id: (await this.groupRepository.create(newGroup)).id };
    }
}
