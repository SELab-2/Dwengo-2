import { ServiceParams } from "../../../config/service";
import { Service } from "../../../config/service";
import { IMessageRepository } from "../../repositories/messageRepositoryInterface";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";

export class GetThreadMessagesParams implements ServiceParams {
  constructor(private _threadId: string) {}

  get threadId(): string {
    return this._threadId;
  }
}

/**
 * note: here we implement Service directly because we need to use both repositories
 */
export class GetThreadMessages implements Service<GetThreadMessagesParams> {
  constructor(
    private questionThreadRepository: IQuestionThreadRepository,
    private messageRepository: IMessageRepository
  ) {
  }
  async execute(input: GetThreadMessagesParams): Promise<object> {
    const thread = await this.questionThreadRepository.getQuestionThreadById(input.threadId);
    // get messageIds from thread and then get messages by ids
    const messages = await Promise.all(thread.messageIds.map(async messageId => {
      return await this.messageRepository.getMessageById(messageId);
    }));
    return {messages: messages.map(message => message.toObject())};
  }
}