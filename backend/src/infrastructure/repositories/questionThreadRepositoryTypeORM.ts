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

    public async create(thread: QuestionThread): Promise<QuestionThread> {
        return await this.datasourceThread.create(thread);
    }

    public async getById(id: string): Promise<QuestionThread> {
        return await this.datasourceThread.getById(id);
    }

    public async update(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread> {
        return await this.datasourceThread.updateQuestionThread(id, updatedThread);
    }

    public async delete(id: string): Promise<void> {
        await this.datasourceThread.deleteQuestionThread(id);
    }

    public async getByAssignmentId(assignmentId: string): Promise<QuestionThread[]> {
        return await this.datasourceThread.getQuestionThreadsByAssignmentId(assignmentId);
    }

    public async getByCreatorId(createrId: string): Promise<QuestionThread[]> {
        return await this.datasourceThread.getQuestionThreadsByCreatorId(createrId);
    }
}
