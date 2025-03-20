import { z } from "zod";
import { getUserGroupsSchema } from "./groupSchemas";
import { GroupService } from "./groupService";
import { Group } from "../../entities/group";

type GetUserGroupsInput = z.infer<typeof getUserGroupsSchema>;

export class GetUserGroups extends GroupService<GetUserGroupsInput> {
    async execute(input: GetUserGroupsInput): Promise<object> {
        const groups: Group[] = await this.groupRepository.getByUserId(input.id);
        return { groups: groups.map(group => group.toObject()) };
    }
}
