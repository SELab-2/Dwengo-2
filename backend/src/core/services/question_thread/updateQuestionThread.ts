import { ServiceParams } from "../../../config/service";
import { QuestionThread, VisibilityType } from "../../entities/questionThread";
import { QuestionThreadBaseService } from "./questionThreadBaseService";

export class UpdateQuestionThreadParams implements ServiceParams {
  constructor(
    private _id: string,
    private _isClosed?: boolean,
    private _visibility?: VisibilityType,
  ) { }

  public get id(): string {
    return this._id;
  }
  public get isClosed(): boolean | undefined {
    return this._isClosed;
  }
  public get visibility(): VisibilityType | undefined {
    return this._visibility;
  }
}

export class UpdateQuestionThread extends QuestionThreadBaseService<UpdateQuestionThreadParams> {

  async execute(input: UpdateQuestionThreadParams): Promise<object> {

    const updatedFields: Partial<QuestionThread> = {};

    if (input.isClosed !== undefined) updatedFields.isClosed = input.isClosed;
    if (input.visibility) updatedFields.visibility = input.visibility;

    return (await this.questionThreadRepository.updateQuestionThread(input.id, updatedFields)).toObject();
  }
}
