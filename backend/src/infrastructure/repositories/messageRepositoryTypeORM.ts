import { Message } from "../../core/entities/message";
import { IMessageRepository } from "../../core/repositories/messageRepositoryInterface";
import { IDatasourceMessage } from "../database/data/data_sources/datasourceMessageInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { EntityNotFoundError } from "../../config/error";

export class IMessageRepositoryTypeORM extends IMessageRepository{

    private datasource: IDatasource;
    private datasourceMessage: Promise<IDatasourceMessage>;
    
    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceMessage = this.datasource.getDatasourceMessage();
    }
    
    public async create(message: Message): Promise<Message> {
        return await (await this.datasourceMessage).create(message);
    }
    
    public async getById(id: string): Promise<Message> {
        const message: Message|null = await (await this.datasourceMessage).getById(id);
        
        if(message) {
            return message;
        } else {
            throw new EntityNotFoundError(`Message with id: ${id} not found`);
        }
    }

    public async update(message: Message): Promise<Message> {
        return await (await this.datasourceMessage).update(message);
    }

    public async delete(message: Message): Promise<void> {
        return await (await this.datasourceMessage).delete(message);
    }
    
}