import { z } from "zod";
import { MessageService } from "./messageService";
import { updateMessageSchema } from "../../../application/schemas/messageSchemas";
import { Message } from "../../entities/message";
import { tryRepoEntityOperation, validateUserRights } from "../../helpers";
import { IMessageRepository } from "../../repositories/messageRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

export class UpdateMessage extends MessageService<UpdateMessageInput> {
    constructor(
        _messageRepository: IMessageRepository,
        private _userRepository: IUserRepository,
    ) {
        super(_messageRepository);
    }
    /**
     * Executes the message update process.
     * @param input - The input data for updating a message, validated by updateMessageSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the message with the given id is not found.
     */
    async execute(userId: string, input: UpdateMessageInput): Promise<object> {
        const message: Message = await tryRepoEntityOperation(
            this.messageRepository.getById(input.id),
            "Message",
            input.id,
            true,
        );
        message.content = input.content;
        await validateUserRights(userId, this._userRepository, undefined, message.senderId);
        await tryRepoEntityOperation(this.messageRepository.update(message), "Message", input.id, true);
        return {};
    }
}
