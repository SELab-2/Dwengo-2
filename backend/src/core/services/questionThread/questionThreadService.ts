import { Service } from "../../../config/service";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";

export abstract class QuestionThreadService<T> implements Service<T> {
    constructor(protected questionThreadRepository: IQuestionThreadRepository) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
