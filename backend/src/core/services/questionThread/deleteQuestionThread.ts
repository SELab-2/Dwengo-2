import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { deleteQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";

export type DeleteQuestionThreadInput = z.infer<typeof deleteQuestionThreadSchema>;

export class DeleteQuestionThread extends QuestionThreadService<DeleteQuestionThreadInput> {
    async execute(input: DeleteQuestionThreadInput): Promise<object> {
        await this.questionThreadRepository.delete(input.id);
        return {};
    }
}
