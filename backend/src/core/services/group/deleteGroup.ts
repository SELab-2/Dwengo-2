import { z } from "zod";
import { GroupService } from "./groupService";
import { deleteGroupSchema } from "./groupSchemas";

type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;

export class DeleteGroup extends GroupService<DeleteGroupInput> {
    async execute(input: DeleteGroupInput): Promise<object> {
        await this.groupRepository.delete(input.id);
        return {};
    }
}
