import { z } from "zod";
import { deleteJoinRequestSchema } from "../../../application/schemas";
import { JoinRequestService } from "./joinRequestService";

export type DeleteJoinRequestInput = z.infer<typeof deleteJoinRequestSchema>;

export class DeleteJoinRequest extends JoinRequestService<DeleteJoinRequestInput> {
    async execute(input: DeleteJoinRequestInput): Promise<object> {
        await this.joinRequestRepository.deleteJoinRequestById(input.id);
        return {};
    }
}
