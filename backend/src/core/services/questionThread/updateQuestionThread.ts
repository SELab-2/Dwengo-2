import { QuestionThreadService } from "./questionThreadService";
import { QuestionThread, VisibilityType } from "../../entities/questionThread";
import { z } from "zod";
import { updateQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";

export type UpdateQuestionThreadInput = z.infer<typeof updateQuestionThreadSchema>;

export class UpdateQuestionThread extends QuestionThreadService<UpdateQuestionThreadInput> {
    async execute(input: UpdateQuestionThreadInput): Promise<object> {
        const updatedFields: Partial<QuestionThread> = {};

        if (input.isClosed !== undefined) updatedFields.isClosed = input.isClosed;
        if (input.visibility) updatedFields.visibility = input.visibility;

        return (await this.questionThreadRepository.updateQuestionThread(input.id, updatedFields)).toObject();
    }
}
