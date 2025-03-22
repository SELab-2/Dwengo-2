import { MessageService } from "./messageService";
import { ServiceParams } from "../../../config/service";

export class GetMessageParams implements ServiceParams {
    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }
}

export class GetMessage extends MessageService<GetMessageParams> {
    async execute(input: GetMessageParams): Promise<object> {
        return (await this.messageRepository.getById(input.id)).toObject();
    }
}
