import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { createQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { QuestionThread } from "../../entities/questionThread";

export type CreateQuestionThreadInput = z.infer<typeof createQuestionThreadSchema>;

export class CreateQuestionThread extends QuestionThreadService<CreateQuestionThreadInput> {
    async execute(input: CreateQuestionThreadInput): Promise<object> {
        const qT: QuestionThread = new QuestionThread(
            input.creatorId,
            input.assignmentId,
            input.learningObjectId,
            input.isClosed,
            input.visibility,
            input.messageIds,
            undefined,
        );
        return (await this.questionThreadRepository.createQuestionThread(qT)).toObject();
    }
}
