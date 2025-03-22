import { EntityNotFoundError } from "../../config/error";
import { Message } from "../../core/entities/message";
import { IMessageRepository } from "../../core/repositories/messageRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceMessage } from "../database/data/data_sources/datasourceMessageInterface";

export class MessageRepositoryTypeORM extends IMessageRepository {
    private datasource: IDatasource;
    private datasourceMessage: Promise<IDatasourceMessage>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceMessage = this.datasource.getDatasourceMessage();
    }

    public async create(message: Message): Promise<Message> {
        return await (await this.datasourceMessage).createMessage(message);
    }

    public async getById(id: string): Promise<Message> {
        const message: Message | null = await (await this.datasourceMessage).getMessageById(id);

        if (message) {
            return message;
        } else {
            throw new EntityNotFoundError(`Message with id: ${id} not found`);
        }
    }

    public async update(message: Message): Promise<Message> {
        return await (await this.datasourceMessage).updateMessage(message);
    }

    public async deleteById(id: string): Promise<void> {
        return await (await this.datasourceMessage).deleteMessageById(id);
    }
}
