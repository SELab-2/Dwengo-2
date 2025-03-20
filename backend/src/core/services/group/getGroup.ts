import { z } from "zod";
import { getGroupSchema } from "./groupSchemas";
import { GroupService } from "./groupService";

type GetGroupInput = z.infer<typeof getGroupSchema>;

export class GetGroup extends GroupService<GetGroupInput> {
    async execute(input: GetGroupInput): Promise<object> {
        return (await this.groupRepository.getById(input.id)).toObject();
    }
}
