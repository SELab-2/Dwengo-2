import { z } from "zod";
import { MessageService } from "./messageService";
import { updateMessageSchema } from "../../../application/schemas/messageSchemas";
import { Message } from "../../entities/message";

export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

export class UpdateMessage extends MessageService<UpdateMessageInput> {
    async execute(input: UpdateMessageInput): Promise<object> {
        const message: Message = await this.messageRepository.getMessageById(input.id);
        message.content = input.content;
        await this.messageRepository.updateMessage(message);
        return {};
    }
}
