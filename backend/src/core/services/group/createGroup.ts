import { z } from "zod";
import { GroupService } from "./groupService";
import { createGroupSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export class CreateGroup extends GroupService<CreateGroupInput> {
    async execute(input: CreateGroupInput): Promise<object> {
        const newGroup = new Group(input.members, input.assignment);
        console.log(input.members);
        return { id: (await this.groupRepository.create(newGroup)).id };
    }
}
