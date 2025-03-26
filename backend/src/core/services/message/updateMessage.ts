import { MessageService } from "./messageService";
import { Message } from "../../entities/message";
import { z } from "zod";
import { updateMessageSchema } from "../../../application/schemas/messageSchemas";

export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

export class UpdateMessage extends MessageService<UpdateMessageInput> {
    async execute(input: UpdateMessageInput): Promise<object> {
        const message: Message = await this.messageRepository.getMessageById(input.id);
        message.content = input.content;
        await this.messageRepository.updateMessage(message);
        return {};
    }
}
