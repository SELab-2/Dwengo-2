import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { QuestionThread } from "../../../../../core/entities/questionThread";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { MessageTypeORM } from "../../data_models/messageTypeorm";
import { QuestionThreadTypeORM } from "../../data_models/questionThreadTypeorm";
import { UserTypeORM } from "../../data_models/userTypeorm";

export class DatasourceThreadTypeORM extends DatasourceTypeORM {
    public async create(thread: QuestionThread): Promise<QuestionThread> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const userRepository = datasource.getRepository(UserTypeORM);
        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);
        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);

        // We find the corresponding user.
        const userModel = await userRepository.findOne({ where: { id: thread.creatorId } });

        if (!userModel) {
            throw new EntityNotFoundError(`User with id: ${thread.creatorId} not found`);
        }

        // We find the corresponding assignment.
        const assignmentModel = await assignmentRepository.findOne({ where: { id: thread.assignmentId } });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id: ${thread.assignmentId} not found`);
        }

        // creation of the thread model.
        const threadModel = QuestionThreadTypeORM.createTypeORM(thread, userModel, assignmentModel);

        const savedThreadModel = await threadRepository.save(threadModel);

        return savedThreadModel.toEntity([]); // We create a thread with no messages yet.
    }

    public async getById(id: string): Promise<QuestionThread> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);
        const messageRepository = datasource.getRepository(MessageTypeORM);

        const threadModel: QuestionThreadTypeORM | null = await threadRepository.findOne({
            where: { id: id },
            relations: ["user", "assignment"],
        });

        if (!threadModel) {
            throw new EntityNotFoundError(`Thread with id ${id} not found`);
        }

        const messageModels = await messageRepository.find({ where: { thread: threadModel } });

        const thread: QuestionThread = threadModel.toEntity(messageModels);
        return thread;
    }

    public async update(thread: QuestionThread): Promise<QuestionThread> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);
        const messageRepository = datasource.getRepository(MessageTypeORM);

        if (!thread.id) {
            throw new Error("Cannot delete a thread without an ID");
        }

        const threadModel: QuestionThreadTypeORM | null = await threadRepository.findOne({ where: { id: thread.id } });

        if (!threadModel) {
            throw new EntityNotFoundError(`Thread with id: ${thread.id} not found`);
        }

        // Delete the old thread
        await threadRepository.delete(threadModel.id);

        // Save the new thread (keeping the thread creator and assignment reference)
        const newThread = QuestionThreadTypeORM.createTypeORM(thread, threadModel.user, threadModel.assignment);
        threadRepository.save(newThread);

        // Get the messages
        const messageModels = await messageRepository.find({ where: { thread: threadModel } });

        const updatedThread: QuestionThread = threadModel.toEntity(messageModels);
        return updatedThread;
    }

    public async delete(thread: QuestionThread): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const messageRepository = datasource.getRepository(MessageTypeORM);
        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);

        if (!thread.id) {
            throw new Error("Cannot delete a thread without an ID");
        }
        // First, delete all  messages of the thread.
        const threadModel: QuestionThreadTypeORM = new QuestionThreadTypeORM();
        threadModel.id = thread.id;

        await messageRepository.delete({ thread: threadModel });

        // Then, delete the thread itself
        await threadRepository.delete(thread.id);
    }

    public async updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        await datasource
            .getRepository(QuestionThreadTypeORM)
            .update(id, QuestionThreadTypeORM.toPartial(updatedThread));
        const questionThread: QuestionThread | null = await this.getById(id);

        if (questionThread) {
            return questionThread;
        } else {
            throw new EntityNotFoundError(`Thread with id: ${id} not found`);
        }
    }

    public async deleteQuestionThread(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const threadRepository = datasource.getRepository(QuestionThreadTypeORM);

        // First check if it exists
        const threadModel: QuestionThreadTypeORM | null = await threadRepository.findOne({
            where: { id: id },
        });

        if (!threadModel) {
            throw new EntityNotFoundError(`Thread with id ${id} not found`);
        }

        await threadRepository.delete(id);
    }

    public async getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const questionThreads: QuestionThreadTypeORM[] = await datasource.getRepository(QuestionThreadTypeORM).find({
            where: { assignment: { id: assignmentId } },
            relations: ["user", "assignment"],
        });

        if (!questionThreads) {
            throw new EntityNotFoundError(`No threads found for assignment with id: ${assignmentId}`);
        }

        const threads = await Promise.all(
            questionThreads.map(async questionThread => {
                const messages: MessageTypeORM[] = await datasource.getRepository(MessageTypeORM).find({
                    where: { thread: questionThread },
                });

                return questionThread.toEntity(messages);
            }),
        );

        return threads;
    }

    public async getQuestionThreadsByCreatorId(creatorId: string): Promise<QuestionThread[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const questionThreads: QuestionThreadTypeORM[] = await datasource.getRepository(QuestionThreadTypeORM).find({
            where: { user: { id: creatorId } },
            relations: ["user", "assignment"],
        });

        const threads = await Promise.all(
            questionThreads.map(async questionThread => {
                const messages: MessageTypeORM[] = await datasource.getRepository(MessageTypeORM).find({
                    where: { thread: questionThread },
                });

                return questionThread.toEntity(messages);
            }),
        );

        return threads;
    }
}
