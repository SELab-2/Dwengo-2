import { z } from "zod";
import { updateGroupSchema } from "./groupSchemas";
import { GroupService } from "./groupService";
import { Group } from "../../entities/group";

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

export class UpdateGroup extends GroupService<UpdateGroupInput> {
    async execute(input: UpdateGroupInput): Promise<object> {
        const group: Group = await this.groupRepository.getById(input.id);
        group.memberIds = input.memberIds;
        return (await this.groupRepository.update(group)).toObject();
    }
}
