import { z } from "zod";
import { JoinRequestService } from "./joinRequestService";
import { deleteJoinRequestSchema } from "../../../application/schemas";

export type DeleteJoinRequestInput = z.infer<typeof deleteJoinRequestSchema>;

export class DeleteJoinRequest extends JoinRequestService<DeleteJoinRequestInput> {
    async execute(input: DeleteJoinRequestInput): Promise<object> {
        await this.joinRequestRepository.deleteJoinRequestById(input.id);
        return {};
    }
}
