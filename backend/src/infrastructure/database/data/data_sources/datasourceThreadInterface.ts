import { DataSource } from "typeorm";
import { QuestionThread } from "../../../../core/entities/questionThread";

export abstract class IDatasourceThread {
    public constructor(protected datasource: DataSource) {}
    public abstract create(message: QuestionThread): Promise<QuestionThread>;
    public abstract getById(id: string): Promise<QuestionThread | null>;
    public abstract update(message: QuestionThread): Promise<QuestionThread>;
    public abstract delete(message: QuestionThread): Promise<void>;
    public abstract updateQuestionThread(id: string, updatedThread: Partial<QuestionThread>): Promise<QuestionThread>;
    public abstract deleteQuestionThread(id: string): Promise<void>;
    public abstract getQuestionThreadsByAssignmentId(assignmentId: string): Promise<QuestionThread[]>;
    public abstract getQuestionThreadsByCreatorId(createrId: string): Promise<QuestionThread[]>;
}
