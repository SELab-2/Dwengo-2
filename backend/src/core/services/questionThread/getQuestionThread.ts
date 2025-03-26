import { QuestionThreadService } from "./questionThreadService";
import { z } from "zod";
import { getQuestionThreadSchema } from "../../../application/schemas/questionThreadSchema";

export type GetQuestionThreadInput = z.infer<typeof getQuestionThreadSchema>;

export class GetQuestionThread extends QuestionThreadService<GetQuestionThreadInput> {
    async execute(input: GetQuestionThreadInput): Promise<object> {
        return (await this.questionThreadRepository.getQuestionThreadById(input.id)).toObject();
    }
}
