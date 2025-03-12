import { ServiceParams } from "../../../config/service";
import { MessageService } from "./messageService";

export class DeleteMessageParams implements ServiceParams {
  constructor(private _id: string) {}

  get id(): string {
    return this._id;
  }
}

export class DeleteMessage extends MessageService<DeleteMessageParams> {
  async execute(input: DeleteMessageParams): Promise<object> {
    await this.messageRepository.deleteMessageById(input.id);
    return {};
  }
}
