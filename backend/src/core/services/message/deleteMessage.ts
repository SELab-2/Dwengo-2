import { MessageService } from "./messageService";
import { ServiceParams } from "../../../config/service";

export class DeleteMessageParams implements ServiceParams {
    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }
}

export class DeleteMessage extends MessageService<DeleteMessageParams> {
    async execute(input: DeleteMessageParams): Promise<object> {
        await this.messageRepository.delete(input.id);
        return {};
    }
}
