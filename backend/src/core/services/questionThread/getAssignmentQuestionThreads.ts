import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { getAssignmentQuestionThreadsSchema } from "../../../application/schemas/questionThreadSchemas";

export type GetAssignmentQuestionThreadsInput = z.infer<typeof getAssignmentQuestionThreadsSchema>;

export class GetAssignmentQuestionThreads extends QuestionThreadService<GetAssignmentQuestionThreadsInput> {
    async execute(input: GetAssignmentQuestionThreadsInput): Promise<object> {
        return {
            threads:
                (await this.questionThreadRepository.getQuestionThreadsByAssignmentId(input.assignmentId)).map(qt =>
                    qt.toObject(),
                ) ?? [],
        };
    }
}
