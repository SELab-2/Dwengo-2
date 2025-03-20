import { EntityNotFoundError } from "../../config/error";
import { QuestionThread } from "../../core/entities/questionThread";
import { IQuestionThreadRepository } from "../../core/repositories/questionThreadRepositoryInterface";
import { DatasourceThreadTypeORM } from "../database/data/data_sources/typeorm/datasourceThreadTypeORM";

export class ThreadRepositoryTypeORM extends IQuestionThreadRepository {
    private datasourceThread: DatasourceThreadTypeORM;

    public constructor() {
        super();
        this.datasourceThread = new DatasourceThreadTypeORM();
    }

    public async createQuestionThread(thread: QuestionThread): Promise<QuestionThread> {
        return await this.datasourceThread.create(thread);
    }

    public async getQuestionThreadById(id: string): Promise<QuestionThread> {
        const thread: QuestionThread | null = await this.datasourceThread.getById(id);

        if (thread) {
            return thread;
        } else {
            throw new EntityNotFoundError(`Thread with id: ${id} not found`);
        }
    }

    public async updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread> {
        return await this.datasourceThread.updateQuestionThread(id, updatedThread);
    }

    public async deleteQuestionThread(id: string): Promise<void> {
        await this.datasourceThread.deleteQuestionThread(id);
    }

    public async getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]> {
        return await this.datasourceThread.getQuestionThreadsByAssignmentId(assignmentId);
    }

    public async getQuestionThreadsByCreatorId(createrId: string): Promise<QuestionThread[]> {
        return await this.datasourceThread.getQuestionThreadsByCreatorId(createrId);
    }
}
