import { Submission } from "../entities/submission";
import { AbstractRepository } from "./abstractRepository";

export abstract class ISubmissionRepository extends AbstractRepository{
    
    public abstract create(submission: Submission): Promise<Submission>;

    public abstract getById(id: string): Promise<Submission>;

    public abstract update(submission: Submission): Promise<Submission>;

    public abstract delete(submission: Submission): Promise<void>;
}