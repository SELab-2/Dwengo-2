import { EntityNotFoundError } from "../../../../../config/error";
import { Message } from "../../../../../core/entities/message";
import { QuestionThreadTypeORM } from "../../data_models/questionThreadTypeorm";
import { ThreadMessageTypeORM } from "../../data_models/threadMessageTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";
import { IDatasourceMessage } from "../datasourceMessageInterface";

export class DatasourceMessageTypeORM extends IDatasourceMessage {
    public async create(message: Message): Promise<Message> {
        const userRepository = this.datasource.getRepository(UserTypeORM)
        const threadRepository = this.datasource.getRepository(QuestionThreadTypeORM)
        const messageRepository = this.datasource.getRepository(ThreadMessageTypeORM)

        // We find the corresponding user.
        const userModel = await userRepository.findOne({ where: { id: message.senderId } });

        if (!userModel){
            throw new EntityNotFoundError(`User with id: ${message.senderId} not found`);
        }

        // We find the thread.
        const threadModel = await threadRepository.findOne({ where: { id: message.threadId } });

        if (!threadModel){
            throw new EntityNotFoundError(`Thread with id: ${message.threadId} not found`);
        }

        // creation of the message model.
        const messageModel = ThreadMessageTypeORM.createTypeORM(message, userModel, threadModel);
        
        const savedMessageModel = await messageRepository.save(messageModel);
        
        return savedMessageModel.toEntity();
    }

    public async getById(id: string): Promise<Message|null> {

        const messageModel: ThreadMessageTypeORM|null = await this.datasource
            .getRepository(ThreadMessageTypeORM)
            .findOne({ where: { id: id } });
        
        if (messageModel !== null) {
            const message: Message = messageModel.toEntity();
            return message;
        }

        return null; // No result
    }

    public async update(message: Message): Promise<Message> {
        this.delete(message);
        return this.create(message);
    }

    public async delete(message: Message): Promise<void> {
        const messageRepository = this.datasource.getRepository(ThreadMessageTypeORM)

        const messageModel: ThreadMessageTypeORM|null = await messageRepository
            .findOne({ where: { id: message.id } });
        
        if (!messageModel){
            throw new EntityNotFoundError(`Message with id: ${message.id} not found`);
        }

        await messageRepository.remove(messageModel);
    }
}
