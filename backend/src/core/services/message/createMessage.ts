import { MessageService } from "./messageService";
import { ServiceParams } from "../../../config/service";
import { Message } from "../../entities/message";

export class CreateMessageParams implements ServiceParams {
    constructor(
        private _senderId: string,
        private _createdAt: Date,
        private _threadId: string,
        private _content: string,
    ) {}

    get senderId(): string {
        return this._senderId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get threadId(): string {
        return this._threadId;
    }

    get content(): string {
        return this._content;
    }
}

export class CreateMessage extends MessageService<CreateMessageParams> {
    async execute(input: CreateMessageParams): Promise<object> {
        const newMessage = new Message(input.senderId, input.createdAt, input.threadId, input.content);
        return { id: (await this.messageRepository.create(newMessage)).id };
    }
}
