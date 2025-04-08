import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Message } from "../../../../../core/entities/message";
import { MessageTypeORM } from "../../data_models/messageTypeorm";
import { QuestionThreadTypeORM } from "../../data_models/questionThreadTypeorm";
import { StudentTypeORM } from "../../data_models/studentTypeorm";
import { TeacherTypeORM } from "../../data_models/teacherTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceMessageTypeORM extends DatasourceTypeORM {
    public async createMessage(message: Message): Promise<Message> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userRepository = datasource.getRepository(UserTypeORM);
        const studentRepository = datasource.getRepository(StudentTypeORM);
        const teacherRepository = datasource.getRepository(TeacherTypeORM);
        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);
        const messageRepository = datasource.getRepository(MessageTypeORM);

        // We find the corresponding user.
        let userModel = await userRepository.findOne({ where: { id: message.senderId } });

        if (!userModel) {
            const studentModel = await studentRepository.findOne({
                where: { id: message.senderId },
                relations: ["user"], // eager-loading the user relation
            });
            if (!studentModel) {
                const teacherModel = await teacherRepository.findOne({
                    where: { id: message.senderId },
                    relations: ["user"], // eager-loading the user relation
                });
                if (!teacherModel) {
                    throw new EntityNotFoundError(`User with id: ${message.senderId} not found`);
                } else {
                    userModel = teacherModel.user;
                }
            } else {
                userModel = studentModel.user;
            }
        }

        // We find the thread.
        const threadModel = await threadRepository.findOne({ where: { id: message.threadId } });

        if (!threadModel) {
            throw new EntityNotFoundError(`Thread with id: ${message.threadId} not found`);
        }

        // creation of the message model.
        const messageModel = MessageTypeORM.createTypeORM(message, userModel, threadModel);

        const savedMessageModel = await messageRepository.save(messageModel);

        return savedMessageModel.toEntity();
    }

    public async getMessageById(id: string): Promise<Message | null> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const messageModel: MessageTypeORM | null = await datasource
            .getRepository(MessageTypeORM)
            .findOne({ where: { id: id } });

        if (messageModel !== null) {
            const message: Message = messageModel.toEntity();
            return message;
        }

        return null; // No result
    }

    public async updateMessage(message: Message): Promise<Message> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        if (!message.id) {
            throw new Error("Message id is required to update a message");
        }
        const messageModel: MessageTypeORM | null = await datasource
            .getRepository(MessageTypeORM)
            .findOne({ where: { id: message.id } });
        if (!messageModel) {
            throw new EntityNotFoundError(`Message with id: ${message.id} not found`);
        }

        this.deleteMessageById(message.id);
        return this.createMessage(message);
    }

    public async deleteMessageById(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const messageRepository = datasource.getRepository(MessageTypeORM);

        const messageModel: MessageTypeORM | null = await messageRepository.findOne({ where: { id: id } });

        if (!messageModel) {
            throw new EntityNotFoundError(`Message with id: ${id} not found`);
        }

        await messageRepository.remove(messageModel);
    }
}
