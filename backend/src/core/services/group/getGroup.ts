import { z } from "zod";
import { getGroupSchema } from "../../../application/schemas/groupSchemas";
import { GroupService } from "./groupService";

export type GetGroupInput = z.infer<typeof getGroupSchema>;

export class GetGroup extends GroupService<GetGroupInput> {
    async execute(input: GetGroupInput): Promise<object> {
        return (await this.groupRepository.getById(input.id)).toObject();
    }
}
