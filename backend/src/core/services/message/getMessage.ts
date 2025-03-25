import { MessageService } from "./messageService";
import { z } from "zod";
import { getMessageSchema } from "../../../application/schemas/messageSchemas";

export type GetMessageInput = z.infer<typeof getMessageSchema>;

export class GetMessage extends MessageService<GetMessageInput> {
    async execute(input: GetMessageInput): Promise<object> {
        return (await this.messageRepository.getMessageById(input.id)).toObject();
    }
}
