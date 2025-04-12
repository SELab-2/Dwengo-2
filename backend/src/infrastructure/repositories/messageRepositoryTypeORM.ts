import { EntityNotFoundError } from "../../config/error";
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
        const message: Message | null = await this.datasourceMessage.getMessageById(id);

        if (message) {
            return message;
        } else {
            throw new EntityNotFoundError(`Message with id: ${id} not found`);
        }
    }

    public async update(message: Message): Promise<Message> {
        return await this.datasourceMessage.updateMessage(message);
    }

    public async delete(id: string): Promise<void> {
        return await this.datasourceMessage.deleteMessageById(id);
    }
}
