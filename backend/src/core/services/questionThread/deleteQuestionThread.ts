import { QuestionThreadService } from "./questionThreadService";
import { deleteQuestionThreadSchema } from "../../../application/schemas/questionThreadSchema";
import { z } from "zod";

export type DeleteQuestionThreadInput = z.infer<typeof deleteQuestionThreadSchema>;

export class DeleteQuestionThread extends QuestionThreadService<DeleteQuestionThreadInput> {
    async execute(input: DeleteQuestionThreadInput): Promise<object> {
        await this.questionThreadRepository.deleteQuestionThread(input.id);
        return {};
    }
}
