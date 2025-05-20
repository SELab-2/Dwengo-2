import { z } from "zod";
import { GroupService } from "./groupService";
import { createGroupSchema } from "../../../application/schemas/groupSchemas";
import { Group } from "../../entities/group";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export class CreateGroup extends GroupService<CreateGroupInput> {
    /**
     * Executes the group creation process.
     * @param input - The input data for creating a group, validated by createGroupSchema.
     * @returns A promise resolving to an object containing the ID of the created group.
     * @throws {ApiError} If the given assignment or members are not found or if the creation fails.
     */
    async execute(userId: string, input: CreateGroupInput): Promise<object> {
        await validateUserRights(userId, UserType.TEACHER);
        const newGroup = new Group(input.members, input.assignment);

        const createdGroup = await tryRepoEntityOperation(
            this.groupRepository.create(newGroup),
            "Assignment | Members",
            `${newGroup.assignmentId} | ${newGroup.memberIds}`,
            true,
        );

        return { id: createdGroup.id };
    }
}
