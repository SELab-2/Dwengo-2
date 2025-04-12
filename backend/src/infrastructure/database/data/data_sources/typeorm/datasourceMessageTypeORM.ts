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
        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);
        const messageRepository = datasource.getRepository(MessageTypeORM);
        const studentRepository = datasource.getRepository(StudentTypeORM);
        const teacherRepository = datasource.getRepository(TeacherTypeORM);

        const studentModel: StudentTypeORM | null = await studentRepository.findOne({
            where: { id: message.senderId },
            relations: ["student"],
        });

        const teacherModel: TeacherTypeORM | null = await teacherRepository.findOne({
            where: { id: message.senderId },
            relations: ["teacher"],
        });

        const userId: string | undefined = studentModel?.student.id || teacherModel?.teacher.id;

        if (!userId) {
            throw new EntityNotFoundError(`Student or teacher with id: ${message.senderId} not found`);
        }

        // We find the corresponding user.
        const userModel = await userRepository.findOne({ where: { id: userId } });

        if (!userModel) {
            throw new EntityNotFoundError(`Student or teacher with id: ${message.senderId} not found`);
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

        const messageModel: MessageTypeORM | null = await datasource.getRepository(MessageTypeORM).findOne({
            where: { id: id },
            relations: ["sent_by", "thread"],
        });

        if (messageModel !== null) {
            const userModel: UserTypeORM | null = await datasource.getRepository(UserTypeORM).findOne({
                where: { id: messageModel.sent_by.id },
            });
            if (userModel) {
                const studentModel: StudentTypeORM | null = await datasource.getRepository(StudentTypeORM).findOne({
                    where: { student: userModel },
                });

                const teacherModel: TeacherTypeORM | null = await datasource.getRepository(TeacherTypeORM).findOne({
                    where: { teacher: userModel },
                });

                if (studentModel?.id) {
                    messageModel.sent_by.id = studentModel.id;
                } else if (teacherModel?.id) {
                    messageModel.sent_by.id = teacherModel.id;
                } else {
                    throw new EntityNotFoundError(
                        `No valid student or teacher found for userModel with id: ${userModel?.id}`,
                    );
                }
            } else {
                return null;
            }

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
