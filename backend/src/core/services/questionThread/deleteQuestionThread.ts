import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { deleteQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteQuestionThreadInput = z.infer<typeof deleteQuestionThreadSchema>;

export class DeleteQuestionThread extends QuestionThreadService<DeleteQuestionThreadInput> {
    /**
     * Executes the thread deletion process.
     * @param input - The input data for deleting a thread, validated by deleteQuestionThreadSchema.
     * @returns An empty object.
     * @throws {ApiError} If the thread with the given id is not found.
     */
    async execute(input: DeleteQuestionThreadInput): Promise<object> {
        await tryRepoEntityOperation(this.questionThreadRepository.delete(input.id), "Thread", input.id, true);
        return {};
    }
}
