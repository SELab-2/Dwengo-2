import { Service, ServiceParams } from "../../../config/service";
import { QuestionThreadBaseService } from "./questionThreadBaseService";

export class GetAssignmentQuestoinThreadsParams implements ServiceParams {
  constructor(private _assignmentId: string) { }
  public get assignmentId(): string {
    return this._assignmentId;
  }
}

export class GetAssignmentQuestionThreads extends QuestionThreadBaseService<GetAssignmentQuestoinThreadsParams> {

  async execute(input: GetAssignmentQuestoinThreadsParams): Promise<object> {
    return { threads: (await this.questionThreadRepository.getQuestionThreadsByAssignmentId(input.assignmentId)).map(qt => qt.toObject()) ?? [] };
  }
}
