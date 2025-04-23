import { z } from "zod";
import { MessageService } from "./messageService";
import { createMessageSchema } from "../../../application/schemas/messageSchemas";
import { Message } from "../../entities/message";
import { tryRepoEntityOperation } from "../../helpers";

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export class CreateMessage extends MessageService<CreateMessageInput> {
    /**
     * Executes the message creation process.
     * @param input - The input data for creating a message, validated by createMessageSchema.
     * @returns A promise resolving to an object containing the ID of the created message.
     * @throws {ApiError} If the given user or thread is not found or if the creation fails.
     */
    async execute(input: CreateMessageInput): Promise<object> {
        const newMessage = new Message(input.senderId, input.createdAt, input.threadId, input.content);

        const createdMessage = await tryRepoEntityOperation(
            this.messageRepository.create(newMessage),
            "User | Thread",
            `${newMessage.senderId} | ${newMessage.threadId}`,
            true,
        );

        return { id: createdMessage.id };
    }
}
