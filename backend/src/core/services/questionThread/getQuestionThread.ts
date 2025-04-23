import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { getQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetQuestionThreadInput = z.infer<typeof getQuestionThreadSchema>;

export class GetQuestionThread extends QuestionThreadService<GetQuestionThreadInput> {
    /**
     * Executes the thread get process.
     * @param input - The input data for getting a thread, validated by getQuestionThreadSchema.
     * @returns A promise resolving to a thread transformed into an object.
     * @throws {ApiError} If the thread with the given id was not found.
     */
    async execute(input: GetQuestionThreadInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.questionThreadRepository.getById(input.id), "Thread", input.id, true)
        ).toObject();
    }
}
