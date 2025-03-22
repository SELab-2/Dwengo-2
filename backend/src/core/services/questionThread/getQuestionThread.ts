import { QuestionThreadBaseService } from "./questionThreadBaseService";
import { ServiceParams } from "../../../config/service";

export class GetQuestionThreadParams implements ServiceParams {
    constructor(private _id: string) {}
    public get id(): string {
        return this._id;
    }
}

export class GetQuestionThread extends QuestionThreadBaseService<GetQuestionThreadParams> {
    async execute(input: GetQuestionThreadParams): Promise<object> {
        return (await this.questionThreadRepository.getById(input.id)).toObject();
    }
}
