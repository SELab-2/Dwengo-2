import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { updateQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { QuestionThread, VisibilityType } from "../../entities/questionThread";

export type UpdateQuestionThreadInput = z.infer<typeof updateQuestionThreadSchema>;

export class UpdateQuestionThread extends QuestionThreadService<UpdateQuestionThreadInput> {
    async execute(input: UpdateQuestionThreadInput): Promise<object> {
        const updatedFields: Partial<QuestionThread> = {};

        if (input.isClosed !== undefined) updatedFields.isClosed = input.isClosed;
        if (input.visibility) updatedFields.visibility = input.visibility;

        await this.questionThreadRepository.update(input.id, updatedFields);
        return {};
    }
}
