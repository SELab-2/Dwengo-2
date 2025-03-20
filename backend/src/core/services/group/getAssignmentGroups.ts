import { GroupService } from "./groupService";
import { Group } from "../../entities/group";
import { z } from "zod";
import { getAssignmentGroupSchema } from "./groupSchemas";

type GetAssignmentGroupsInput = z.infer<typeof getAssignmentGroupSchema>;

export class GetAssignmentGroups extends GroupService<GetAssignmentGroupsInput> {
    async execute(input: GetAssignmentGroupsInput): Promise<object> {
        const groups: Group[] = await this.groupRepository.getByAssignmentId(input.id);
        return { groups: groups.map(group => group.toObject()) };
    }
}
