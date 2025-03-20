import { EntityNotFoundError } from "../../config/error";
import { Message } from "../../core/entities/message";
import { IMessageRepository } from "../../core/repositories/messageRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceMessage } from "../database/data/data_sources/datasourceMessageInterface";
import { DatasourceMessageTypeORM } from "../database/data/data_sources/typeorm/datasourceMessageTypeORM";

export class MessageRepositoryTypeORM extends IMessageRepository {
    private datasourceMessage: DatasourceMessageTypeORM;

    public constructor() {
        super();
        this.datasourceMessage = new DatasourceMessageTypeORM();
    }

    public async createMessage(message: Message): Promise<Message> {
        return await this.datasourceMessage.createMessage(message);
    }

    public async getMessageById(id: string): Promise<Message> {
        const message: Message | null = await this.datasourceMessage.getMessageById(id);

        if (message) {
            return message;
        } else {
            throw new EntityNotFoundError(`Message with id: ${id} not found`);
        }
    }

    public async updateMessage(message: Message): Promise<Message> {
        return await this.datasourceMessage.updateMessage(message);
    }

    public async deleteMessageById(id: string): Promise<void> {
        return await this.datasourceMessage.deleteMessageById(id);
    }
}
