import { z } from "zod";
import { GroupService } from "./groupService";
import { getGroupSchema } from "../../../application/schemas/groupSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetGroupInput = z.infer<typeof getGroupSchema>;

export class GetGroup extends GroupService<GetGroupInput> {
    /**
     * Executes the group get process.
     * @param input - The input data for getting a group, validated by getGroupSchema.
     * @returns A promise resolving to a group transformed into an object.
     * @throws {ApiError} If the group with the given id was not found.
     */
    async execute(_userId: string, input: GetGroupInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.groupRepository.getById(input.id), "Group", input.id, true)
        ).toObject();
    }
}
