import { z } from "zod";
import { GroupService } from "./groupService";
import { getUserGroupsSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type GetUserGroupsInput = z.infer<typeof getUserGroupsSchema>;

export class GetUserGroups extends GroupService<GetUserGroupsInput> {
    /**
     * Executes the user groups get process.
     * @param input - The input data for getting user groups, validated by getUserGroupsSchema.
     * @returns A promise resolving to an object with a list of groups.
     * @throws {ApiError} If the user with the given id is not found.
     */
    async execute(userId: string, input: GetUserGroupsInput): Promise<object> {
        await validateUserRights(userId, undefined, input.idParent);
        const groups: Group[] = await tryRepoEntityOperation(
            this.groupRepository.getByUserId(input.idParent),
            "User",
            input.idParent,
            true,
        );
        return { groups: groups.map(group => group.id) };
    }
}
