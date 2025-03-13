import { MessageService } from "./messageService";
import { ServiceParams } from "../../../config/service";
import { Message } from "../../entities/message";

export class UpdateMessageParams implements ServiceParams {
    constructor(
        private _id: string,
        private _content: string,
    ) {}

    get id(): string {
        return this._id;
    }

    get content(): string {
        return this._content;
    }
}

export class UpdateMessage extends MessageService<UpdateMessageParams> {
    async execute(input: UpdateMessageParams): Promise<object> {
        const message: Message = await this.messageRepository.getMessageById(input.id);
        message.content = input.content;
        await this.messageRepository.updateMessage(message);
        return message.toObject();
    }
}
