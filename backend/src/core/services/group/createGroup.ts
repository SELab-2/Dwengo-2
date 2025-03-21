import { z } from "zod";
import { createGroupSchema } from "./groupSchemas";
import { GroupService } from "./groupService";
import { Group } from "../../entities/group";

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export class CreateGroup extends GroupService<CreateGroupInput> {
    async execute(input: CreateGroupInput): Promise<object> {
        const newGroup = new Group(input.memberIds, input.assignmentId);
        return { id: (await this.groupRepository.create(newGroup)).id };
    }
}
