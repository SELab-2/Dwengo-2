import { StatusType, Submission } from "../../core/entities/submission";
import { ISubmissionRepository } from "../../core/repositories/submissionRepositoryInterface";
import { DatasourceSubmissionTypeORM } from "../database/data/data_sources/typeorm/datasourceSubmissionTypeORM";

export class SubmissionRepositoryTypeORM extends ISubmissionRepository {
    private datasourceSubmission: DatasourceSubmissionTypeORM;

    public constructor() {
        super();
        this.datasourceSubmission = new DatasourceSubmissionTypeORM();
    }

    public async getMonthlySubmissionCounts(classId: string): Promise<number[]> {
        return await this.datasourceSubmission.getMonthlySubmissionCounts(classId);
    }

    public async create(submission: Submission): Promise<string> {
        return await this.datasourceSubmission.create(submission);
    }

    public async getById(id: string): Promise<Submission> {
        return await this.datasourceSubmission.getById(id);
    }

    public async update(id: string, status: StatusType): Promise<void> {
        return await this.datasourceSubmission.update(id, status);
    }

    public async delete(submissionId: string): Promise<void> {
        return await this.datasourceSubmission.delete(submissionId);
    }

    public async getAllForAssignment(assignmentId: string) {
        return await (await this.datasourceSubmission).getAllForAssignment(assignmentId)
    }

    public async getAllForStudentInAssignment(studentId: string, assignmentId: string): Promise<Submission[]> {
        return await (await this.datasourceSubmission).getAllForStudentInAssignment(studentId, assignmentId);
    }

    public async getAllForStudentInAssignmentStep(
        studentId: string,
        assignmentId: string,
        taskId: string,
    ): Promise<Submission[]> {
        return await (
            await this.datasourceSubmission
        ).getAllForStudentInAssignmentStep(studentId, assignmentId, taskId);
    }

    public async getByStudentId(studentId: string): Promise<Submission[]> {
        return await this.datasourceSubmission.getByStudentId(studentId);
    }
}
