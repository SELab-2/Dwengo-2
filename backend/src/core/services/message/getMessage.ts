import { z } from "zod";
import { MessageService } from "./messageService";
import { getMessageSchema } from "../../../application/schemas/messageSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetMessageInput = z.infer<typeof getMessageSchema>;

export class GetMessage extends MessageService<GetMessageInput> {
    /**
     * Executes the message get process.
     * @param input - The input data for getting a message, validated by getMessageSchema.
     * @returns A promise resolving to a message transformed into an object.
     * @throws {ApiError} If the message with the given id was not found.
     */
    async execute(input: GetMessageInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.messageRepository.getById(input.id), "Message", input.id, true)
        ).toObject();
    }
}
