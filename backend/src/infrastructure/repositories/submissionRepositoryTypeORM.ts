import { EntityNotFoundError } from "../../config/error";
import { Submission } from "../../core/entities/submission";
import { ISubmissionRepository } from "../../core/repositories/submissionRepository";
import { IDatasource } from "../database/data/data_sources/datasourceInterface";
import { IDatasourceSubmission } from "../database/data/data_sources/datasourceSubmissionInterface";

export class SubmissionRepositoryTypeORM extends ISubmissionRepository {
    
    private datasource: IDatasource;
    private datasourceSubmission: Promise<IDatasourceSubmission>;
    
    public constructor() {
        super();
        this.datasource = this.datasourceFactory.createDatasource();
        this.datasourceSubmission = this.datasource.getDatasourceSubmission();
    }
    

    public async create(submission: Submission): Promise<Submission> {
        return await (await this.datasourceSubmission).create(submission);
    }

    public async getById(id: string): Promise<Submission> {
        const teacher: Submission|null = await (await this.datasourceSubmission).getById(id);
        
        if(teacher) {
            return teacher;
        } else {
            throw new EntityNotFoundError(`Submission with id: ${id} not found`);
        }
    }

    public async update(submission: Submission): Promise<Submission> {
        return await (await this.datasourceSubmission).update(submission);
    }

    public async delete(submission: Submission): Promise<void> {
        return await (await this.datasourceSubmission).delete(submission);
    }
}
