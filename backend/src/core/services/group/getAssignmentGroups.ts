import { z } from "zod";
import { GroupService } from "./groupService";
import { getAssignmentGroupsSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";
import { tryRepoEntityOperation } from "../../helpers";

export type GetAssignmentGroupsInput = z.infer<typeof getAssignmentGroupsSchema>;

export class GetAssignmentGroups extends GroupService<GetAssignmentGroupsInput> {
    /**
     * Executes the assignment groups get process.
     * @param input - The input data for getting assignment groups, validated by getAssignmentGroupsSchema.
     * @returns A promise resolving to an object with a list of groups.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: GetAssignmentGroupsInput): Promise<object> {
        const groups: Group[] = await tryRepoEntityOperation(
            this.groupRepository.getByAssignmentId(input.idParent),
            "Assignment",
            input.idParent,
            true,
        );
        return { groups: groups.map(group => group.id) };
    }
}
