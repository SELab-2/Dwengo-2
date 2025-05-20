import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { updateQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { QuestionThread } from "../../entities/questionThread";
import { tryRepoEntityOperation } from "../../helpers";

export type UpdateQuestionThreadInput = z.infer<typeof updateQuestionThreadSchema>;

export class UpdateQuestionThread extends QuestionThreadService<UpdateQuestionThreadInput> {
    /**
     * Executes the thread update process.
     * @param input - The input data for updating a thread, validated by updateQuestionThreadSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the thread with the given id is not found.
     */
    async execute(_userId: string, input: UpdateQuestionThreadInput): Promise<object> {
        const updatedFields: Partial<QuestionThread> = {};

        if (input.isClosed !== undefined) updatedFields.isClosed = input.isClosed;
        if (input.visibility) updatedFields.visibility = input.visibility;

        await tryRepoEntityOperation(
            this.questionThreadRepository.update(input.id, updatedFields),
            "Thread",
            input.id,
            true,
        );
        return {};
    }
}
