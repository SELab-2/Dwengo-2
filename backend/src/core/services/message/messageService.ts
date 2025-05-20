import { Service } from "../../../config/service";
import { IMessageRepository } from "../../repositories/messageRepositoryInterface";

export abstract class MessageService<T> implements Service<T> {
    constructor(protected messageRepository: IMessageRepository) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
