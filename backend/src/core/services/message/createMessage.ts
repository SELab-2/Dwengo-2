import { z } from "zod";
import { MessageService } from "./messageService";
import { createMessageSchema } from "../../../application/schemas/messageSchemas";
import { Message } from "../../entities/message";

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export class CreateMessage extends MessageService<CreateMessageInput> {
    async execute(input: CreateMessageInput): Promise<object> {
        const newMessage = new Message(input.senderId, input.createdAt, input.threadId, input.content);
        return { id: (await this.messageRepository.createMessage(newMessage)).id };
    }
}
