import { z } from "zod";
import { GroupService } from "./groupService";
import { getAssignmentGroupsSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";

export type GetAssignmentGroupsInput = z.infer<typeof getAssignmentGroupsSchema>;

export class GetAssignmentGroups extends GroupService<GetAssignmentGroupsInput> {
    async execute(input: GetAssignmentGroupsInput): Promise<object> {
        const groups: Group[] = await this.groupRepository.getByAssignmentId(input.idParent);
        return { groups: groups.map(group => group.id) };
    }
}
