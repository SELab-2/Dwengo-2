import { GroupService } from "./groupService";
import { ServiceParams } from "../../../config/service";
import { Group } from "../../entities/group";

export class GetAssignmentGroupsParams implements ServiceParams {
    constructor(private _assignmentId: string) {}

    get assignmentId(): string {
        return this._assignmentId;
    }
}

export class GetAssignmentGroups extends GroupService<GetAssignmentGroupsParams> {
    async execute(input: GetAssignmentGroupsParams): Promise<object> {
        const groups: Group[] = await this.groupRepository.getByAssignmentId(input.assignmentId);
        return { groups: groups.map(group => group.toObject()) };
    }
}
