import { DataSource } from "typeorm";
import { Submission } from "../../../../core/entities/submission";

export abstract class IDatasourceSubmission {
    public constructor(protected datasource: DataSource) {}
    public abstract create(submission: Submission): Promise<string>;
    public abstract getById(id: string): Promise<Submission | null>;
    public abstract update(submission: Submission): Promise<Submission>;
    public abstract delete(submissionId: string): Promise<void>;
    public abstract getAllForStudentInAssignmentStep(studentId: string, assignmentId: string, learningObjectId: string): Promise<Submission[]>;
}
