import { z } from "zod";
import { deleteGroupSchema } from "./groupSchemas";
import { GroupService } from "./groupService";

export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;

export class DeleteGroup extends GroupService<DeleteGroupInput> {
    async execute(input: DeleteGroupInput): Promise<object> {
        await this.groupRepository.delete(input.id);
        return {};
    }
}
