import { z } from "zod";
import { GroupService } from "./groupService";
import { getGroupSchema } from "../../../application/schemas/groupSchemas";

export type GetGroupInput = z.infer<typeof getGroupSchema>;

export class GetGroup extends GroupService<GetGroupInput> {
    async execute(input: GetGroupInput): Promise<object> {
        return (await this.groupRepository.getById(input.id)).toObject();
    }
}
