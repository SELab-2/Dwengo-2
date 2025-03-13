import { EntityNotFoundError } from "../../config/error";
import { QuestionThread } from "../../core/entities/questionThread";
import { IQuestionThreadRepository } from "../../core/repositories/questionThreadRepositoryInterface";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceThread } from "../database/data/data_sources/datasourceThreadInterface";

export class ThreadRepositoryTypeORM extends IQuestionThreadRepository {
    private datasource: IDatasource;
    private datasourceThread: Promise<IDatasourceThread>;

    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceThread = this.datasource.getDatasourceThread();
    }

    public async createQuestionThread(thread: QuestionThread): Promise<QuestionThread> {
        return await (await this.datasourceThread).create(thread);
    }

    public async getQuestionThreadById(id: string): Promise<QuestionThread> {
        const thread: QuestionThread | null = await (await this.datasourceThread).getById(id);

        if (thread) {
            return thread;
        } else {
            throw new EntityNotFoundError(`Thread with id: ${id} not found`);
        }
    }

    public async updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread> {
        return await (await this.datasourceThread).updateQuestionThread(id, updatedThread);
    }

    public async deleteQuestionThread(id: string): Promise<void> {
        await (await this.datasourceThread).deleteQuestionThread(id);
    }

    public async getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]> {
        return await (await this.datasourceThread).getQuestionThreadsByAssignmentId(assignmentId);
    }

    public async getQuestionThreadsByCreatorId(createrId: string): Promise<QuestionThread[]> {
        return await (await this.datasourceThread).getQuestionThreadsByCreatorId(createrId);
    }
}
