import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { deleteJoinRequestSchema } from "../../../application/schemas";
import { UserType } from "../../entities/user";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";

export type DeleteJoinRequestInput = z.infer<typeof deleteJoinRequestSchema>;

export class DeleteJoinRequest extends JoinRequestService<DeleteJoinRequestInput> {
    /**
     * Executes the group deletion process.
     * @param input - The input data for deleting a group, validated by deleteGroupSchema.
     * @returns An empty object.
     * @throws {ApiError} If the group with the given id is not found.
     */
    async execute(userId: string, input: DeleteJoinRequestInput): Promise<object> {
        await validateUserRights(userId, this.userRepository, UserType.TEACHER, undefined);
        await tryRepoEntityOperation(this.joinRequestRepository.delete(input.id), "JoinRequest", input.id, true);
        return {};
    }
}
