import { Message } from "../../core/entities/message";
import { IMessageRepository } from "../../core/repositories/messageRepositoryInterface";
import { DatasourceMessageTypeORM } from "../database/data/data_sources/typeorm/datasourceMessageTypeORM";

export class MessageRepositoryTypeORM extends IMessageRepository {
    private datasourceMessage: DatasourceMessageTypeORM;

    public constructor() {
        super();
        this.datasourceMessage = new DatasourceMessageTypeORM();
    }

    public async create(message: Message): Promise<Message> {
        return await this.datasourceMessage.createMessage(message);
    }

    public async getById(id: string): Promise<Message> {
        return this.datasourceMessage.getMessageById(id);
    }

    public async update(message: Message): Promise<Message> {
        return await this.datasourceMessage.updateMessage(message);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceMessage.deleteMessageById(id);
    }
}
