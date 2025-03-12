import { ServiceParams } from "../../../config/service";
import { QuestionThreadBaseService } from "./questionThreadBaseService";

export class DeleteQuestionThreadParams implements ServiceParams {
  constructor(
    private _id: string,
  ){}

  public get id(): string {
    return this._id;
  }
}

export class DeleteQuestionThread extends QuestionThreadBaseService<DeleteQuestionThreadParams> {
  async execute(input: DeleteQuestionThreadParams): Promise<object> {
    await this.questionThreadRepository.deleteQuestionThread(input.id);
    return {};
  }
}
