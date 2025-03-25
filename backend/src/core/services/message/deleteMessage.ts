import { MessageService } from "./messageService";
import { z } from "zod";
import { deleteMessageSchema } from "../../../application/schemas/messageSchemas";

export type DeleteMessageInput = z.infer<typeof deleteMessageSchema>; 

export class DeleteMessage extends MessageService<DeleteMessageInput> {
    async execute(input: DeleteMessageInput): Promise<object> {
        await this.messageRepository.deleteMessageById(input.id);
        return {};
    }
}
