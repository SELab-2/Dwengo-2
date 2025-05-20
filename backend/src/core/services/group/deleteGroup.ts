import { z } from "zod";
import { GroupService } from "./groupService";
import { deleteGroupSchema } from "../../../application/schemas/groupSchemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type DeleteGroupInput = z.infer<typeof deleteGroupSchema>;

export class DeleteGroup extends GroupService<DeleteGroupInput> {
    /**
     * Executes the group deletion process.
     * @param input - The input data for deleting a group, validated by deleteGroupSchema.
     * @returns An empty object.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(userId: string, input: DeleteGroupInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        await tryRepoEntityOperation(this.groupRepository.delete(input.id), "Group", input.id, true);
        return {};
    }
}
