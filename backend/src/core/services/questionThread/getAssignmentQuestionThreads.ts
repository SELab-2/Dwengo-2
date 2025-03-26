import { QuestionThreadService } from "./questionThreadService";
import { getAssignmentQuestionThreadsSchema } from "../../../application/schemas/questionThreadSchema";
import { z } from "zod";

export type GetAssignmentQuestionThreadsInput = z.infer<typeof getAssignmentQuestionThreadsSchema>

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
