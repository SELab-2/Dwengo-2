import { z } from "zod";
import { GroupService } from "./groupService";
import { updateGroupSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";
import { tryRepoEntityOperation } from "../../helpers";

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

export class UpdateGroup extends GroupService<UpdateGroupInput> {
    /**
     * Executes the group update process.
     * @param input - The input data for updating a group, validated by updateGroupSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(input: UpdateGroupInput): Promise<object> {
        const group: Group = await tryRepoEntityOperation(
            this.groupRepository.getById(input.id),
            "Group",
            input.id,
            true,
        );
        group.memberIds = input.members;

        await tryRepoEntityOperation(this.groupRepository.update(group), "Group", input.id, true);
        return {};
    }
}
