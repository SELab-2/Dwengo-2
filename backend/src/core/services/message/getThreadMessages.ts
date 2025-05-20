import { z } from "zod";
import { getThreadMessagesSchema } from "../../../application/schemas/messageSchemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";

export type GetThreadMessagesInput = z.infer<typeof getThreadMessagesSchema>;

/**
 * note: here we implement Service directly because we need to use both repositories
 */
export class GetThreadMessages implements Service<GetThreadMessagesInput> {
    /**
     * Executes the thread messages get process.
     * @param input - The input data for getting thread messages, validated by getThreadMessagesSchema.
     * @returns A promise resolving to an object with a list of messages.
     * @throws {ApiError} If the thread with the given id is not found.
     */
    constructor(private questionThreadRepository: IQuestionThreadRepository) {}
    async execute(_userId: string, input: GetThreadMessagesInput): Promise<object> {
        const thread = await tryRepoEntityOperation(
            this.questionThreadRepository.getById(input.idParent),
            "Thread",
            input.idParent,
            true,
        );
        return { messages: thread.messageIds };
    }
}
