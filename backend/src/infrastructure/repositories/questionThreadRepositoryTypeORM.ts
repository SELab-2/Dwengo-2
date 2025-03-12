import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { EntityNotFoundError } from "../../config/error";
import { QuestionThread } from "../../core/entities/questionThread";
import { IDatasourceThread } from "../database/data/data_sources/datasourceThreadInterface";
import { IQuestionThreadRepository } from "../../core/repositories/questionThreadRepositoryInterface";

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
        const thread: QuestionThread|null = await (await this.datasourceThread).getById(id);
        
        if(thread) {
            return thread;
        } else {
            throw new EntityNotFoundError(`Thread with id: ${id} not found`);
        }
    }

    public async updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread> {
        throw new Error("Not implemented yet");
    }

    public async deleteQuestionThread(id: string): Promise<void> {
        throw new Error("Not implemented yet");
    }

    public async getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]> {
        throw new Error("Not implemented yet");
    }

    public async getQuestionThreadsByCreatorId(createrId: string): Promise<QuestionThread[]> {
        throw new Error("Not implemented yet");
    }
    
}