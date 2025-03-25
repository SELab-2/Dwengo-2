import { MessageService } from "./messageService";
import { Message } from "../../entities/message";
import { z } from "zod";
import { createMessageSchema } from "../../../application/schemas/messageSchemas";

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

export class CreateMessage extends MessageService<CreateMessageInput> {
    async execute(input: CreateMessageInput): Promise<object> {
        const newMessage = new Message(input.senderId, input.createdAt, input.threadId, input.content);
        return { id: (await this.messageRepository.createMessage(newMessage)).id };
    }
}
