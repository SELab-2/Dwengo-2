import { Service, ServiceParams } from "../../../config/service";
import { QuestionThreadBaseService } from "./questionThreadBaseService";

export class GetAssignmentQuestionThreadsParams implements ServiceParams {
  constructor(private _assignmentId: string) { }
  public get assignmentId(): string {
    return this._assignmentId;
  }
}

export class GetAssignmentQuestionThreads extends QuestionThreadBaseService<GetAssignmentQuestionThreadsParams> {

  async execute(input: GetAssignmentQuestionThreadsParams): Promise<object> {
    return { threads: (await this.questionThreadRepository.getQuestionThreadsByAssignmentId(input.assignmentId)).map(qt => qt.toObject()) ?? [] };
  }
}
