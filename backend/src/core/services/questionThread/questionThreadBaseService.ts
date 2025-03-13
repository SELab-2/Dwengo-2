import { Service, ServiceParams } from "../../../config/service";
import { IQuestionThreadRepository } from "../../repositories/questionThreadRepositoryInterface";

export abstract class QuestionThreadBaseService<T extends ServiceParams> implements Service<T> {
    constructor(protected questionThreadRepository: IQuestionThreadRepository) {}
    abstract execute(input: T): Promise<object>;
}
