import { Service, ServiceParams } from "../../../config/service";
import { QuestionThread, VisibilityType } from "../../entities/questionThread";
import { QuestionThreadBaseService } from "./questionThreadBaseService";

export class CreateQuestionThreadParams implements ServiceParams {
  public constructor(
    private _creatorId: string,
    private _assignmentId: string,
    private _learningObjectId: string,
    private _isClosed: boolean = false,
    private _visibility: VisibilityType,
    private _messageIds: string[],
    private _id?: string,
  ) { }

  // Getters
  public get creatorId(): string {
    return this._creatorId;
  }
  public get assignmentId(): string {
    return this._assignmentId;
  }
  public get learningObjectId(): string {
    return this._learningObjectId;
  }
  public get isClosed(): boolean {
    return this._isClosed;
  }
  public get visibility(): VisibilityType {
    return this._visibility;
  }
  public get messageIds(): string[] {
    return this._messageIds;
  }
  public get id(): string | undefined {
    return this._id;
  }
}

export class CreateQuestionThread extends QuestionThreadBaseService<CreateQuestionThreadParams> {

  async execute(input: CreateQuestionThreadParams): Promise<object> {
    const qT: QuestionThread = new QuestionThread(
      input.creatorId,
      input.assignmentId,
      input.learningObjectId,
      input.isClosed,
      input.visibility,
      input.messageIds,
      undefined
    )
    return (await this.questionThreadRepository.createQuestionThread(qT)).toObject();
  }
}
