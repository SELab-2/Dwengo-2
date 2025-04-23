import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { deleteJoinRequestSchema } from "../../../application/schemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteJoinRequestInput = z.infer<typeof deleteJoinRequestSchema>;

export class DeleteJoinRequest extends JoinRequestService<DeleteJoinRequestInput> {
    /**
     * Executes the group deletion process.
     * @param input - The input data for deleting a group, validated by deleteGroupSchema.
     * @returns An empty object.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(input: DeleteJoinRequestInput): Promise<object> {
        await tryRepoEntityOperation(this.joinRequestRepository.delete(input.id), "JoinRequest", input.id, true);
        return {};
    }
}
