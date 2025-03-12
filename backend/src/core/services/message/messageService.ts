import { Service, ServiceParams } from "../../../config/service";
import { IMessageRepository } from "../../repositories/messageRepositoryInterface";

export abstract class MessageService<T extends ServiceParams> implements Service<T>{
    constructor(protected messageRepository: IMessageRepository){}
    abstract execute(input: T):  Promise<object>;
}