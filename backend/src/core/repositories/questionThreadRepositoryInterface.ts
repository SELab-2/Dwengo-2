import { QuestionThread } from "../entities/questionThread";
import { AbstractRepository } from "./AbstractRepository";

export abstract class IThreadRepository extends AbstractRepository {

    public abstract create(message: QuestionThread): Promise<QuestionThread>;

    public abstract getById(id: string): Promise<QuestionThread>;

    public abstract update(message: QuestionThread): Promise<QuestionThread>;

    public abstract delete(message: QuestionThread): Promise<void>;
}