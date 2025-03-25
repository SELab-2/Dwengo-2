import { z } from "zod";
import { Service } from "../../../config/service";
import { IMessageRepository } from "../../repositories/messageRepositoryInterface";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";
import { getThreadMessagesSchema } from "../../../application/schemas/messageSchemas";

export type GetThreadMessagesInput = z.infer<typeof getThreadMessagesSchema>;

/**
 * note: here we implement Service directly because we need to use both repositories
 */
export class GetThreadMessages implements Service<GetThreadMessagesInput> {
    constructor(
        private questionThreadRepository: IQuestionThreadRepository,
        private messageRepository: IMessageRepository,
    ) {}
    async execute(input: GetThreadMessagesInput): Promise<object> {
        const thread = await this.questionThreadRepository.getQuestionThreadById(input.threadId);
        // get messageIds from thread and then get messages by ids
        const messages = await Promise.all(
            thread.messageIds.map(async messageId => {
                return await this.messageRepository.getMessageById(messageId);
            }),
        );
        return { messages: messages.map(message => message.toObject()) };
    }
}
