import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { getAssignmentQuestionThreadsSchema } from "../../../application/schemas/questionThreadSchemas";

export type GetAssignmentQuestionThreadsInput = z.infer<typeof getAssignmentQuestionThreadsSchema>;

export class GetAssignmentQuestionThreads extends QuestionThreadService<GetAssignmentQuestionThreadsInput> {
    async execute(input: GetAssignmentQuestionThreadsInput): Promise<object> {
        const threadIds = (await this.questionThreadRepository.getByAssignmentId(input.idParent)).map(qt => qt.id);
        return { threads: threadIds };
    }
}
