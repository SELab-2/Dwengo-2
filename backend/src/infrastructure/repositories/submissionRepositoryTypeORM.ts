import { Submission } from "../../core/entities/submission";
import { ISubmissionRepository } from "../../core/repositories/submissionRepositoryInterface";
import { DatasourceSubmissionTypeORM } from "../database/data/data_sources/typeorm/datasourceSubmissionTypeORM";

export class SubmissionRepositoryTypeORM extends ISubmissionRepository {
    private datasourceSubmission: DatasourceSubmissionTypeORM;

    public constructor() {
        super();
        this.datasourceSubmission = new DatasourceSubmissionTypeORM();
    }

    public async create(submission: Submission): Promise<string> {
        return await this.datasourceSubmission.create(submission);
    }

    public async getById(id: string): Promise<Submission> {
        return await this.datasourceSubmission.getById(id);
    }

    public async update(submission: Submission): Promise<Submission> {
        return await this.datasourceSubmission.update(submission);
    }

    public async delete(submissionId: string): Promise<void> {
        return await this.datasourceSubmission.delete(submissionId);
    }

    public async getAllForStudentInAssignment(studentId: string, assignmentId: string): Promise<Submission[]> {
        return await (await this.datasourceSubmission).getAllForStudentInAssignment(studentId, assignmentId);
    }

    public async getAllForStudentInAssignmentStep(
        studentId: string,
        assignmentId: string,
        learningObjectId: string,
    ): Promise<Submission[]> {
        return await (
            await this.datasourceSubmission
        ).getAllForStudentInAssignmentStep(studentId, assignmentId, learningObjectId);
    }

    public async getByStudentId(studentId: string): Promise<Submission[]> {
        return await this.datasourceSubmission.getByStudentId(studentId);
    }
}
