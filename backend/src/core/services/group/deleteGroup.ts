import { GroupService } from "./groupService";
import { ServiceParams } from "../../../config/service";

export class DeleteGroupParams implements ServiceParams {
    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }
}

export class DeleteGroup extends GroupService<DeleteGroupParams> {
    async execute(input: DeleteGroupParams): Promise<object> {
        await this.groupRepository.delete(input.id);
        return {};
    }
}
