import { Submission } from "../entities/submission";

export abstract class ISubmissionRepository {
    
    public abstract create(submission: Submission, teacherId: string): Promise<Submission>;

    public abstract getById(id: string): Promise<Submission>;

    public abstract update(submission: Submission): Promise<Submission>;

    public abstract delete(id: string): Promise<void>;
}