import { z } from "zod";
import { MessageService } from "./messageService";
import { deleteMessageSchema } from "../../../application/schemas/messageSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>;

export class DeleteMessage extends MessageService<DeleteMessageInput> {
    /**
     * Executes the message deletion process.
     * @param input - The input data for deleting a message, validated by deleteMessageSchema.
     * @returns An empty object.
     * @throws {ApiError} If the message with the given id is not found.
     */
    async execute(input: DeleteMessageInput): Promise<object> {
        await tryRepoEntityOperation(this.messageRepository.delete(input.id), "Message", input.id, true);
        return {};
    }
}
