import { z } from "zod";
import { getThreadMessagesSchema } from "../../../application/schemas/messageSchemas";
import { Service } from "../../../config/service";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";

export type GetThreadMessagesInput = z.infer<typeof getThreadMessagesSchema>;

/**
 * note: here we implement Service directly because we need to use both repositories
 */
export class GetThreadMessages implements Service<GetThreadMessagesInput> {
    constructor(private questionThreadRepository: IQuestionThreadRepository) {}
    async execute(input: GetThreadMessagesInput): Promise<object> {
        const thread = await this.questionThreadRepository.getQuestionThreadById(input.idParent);
        return { messages: thread.messageIds };
    }
}
