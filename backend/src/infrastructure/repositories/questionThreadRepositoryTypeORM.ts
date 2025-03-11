import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { EntityNotFoundError } from "../../config/error";
import { IThreadRepository } from "../../core/repositories/questionThreadRepositoryInterface";
import { QuestionThread } from "../../core/entities/questionThread";
import { IDatasourceThread } from "../database/data/data_sources/datasourceThreadInterface";

export class IThreadRepositoryTypeORM extends IThreadRepository{

    private datasource: IDatasource;
    private datasourceThread: Promise<IDatasourceThread>;
    
    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceThread = this.datasource.getDatasourceThread();
    }
    
    public async create(thread: QuestionThread): Promise<QuestionThread> {
        return await (await this.datasourceThread).create(thread);
    }
    
    public async getById(id: string): Promise<QuestionThread> {
        const thread: QuestionThread|null = await (await this.datasourceThread).getById(id);
        
        if(thread) {
            return thread;
        } else {
            throw new EntityNotFoundError(`Thread with id: ${id} not found`);
        }
    }

    public async update(thread: QuestionThread): Promise<QuestionThread> {
        return await (await this.datasourceThread).update(thread);
    }

    public async delete(thread: QuestionThread): Promise<void> {
        return await (await this.datasourceThread).delete(thread);
    }
    
}