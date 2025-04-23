import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { getAssignmentQuestionThreadsSchema } from "../../../application/schemas/questionThreadSchemas";
import { QuestionThread } from "../../entities/questionThread";
import { tryRepoEntityOperation } from "../../helpers";

export type GetAssignmentQuestionThreadsInput = z.infer<typeof getAssignmentQuestionThreadsSchema>;

export class GetAssignmentQuestionThreads extends QuestionThreadService<GetAssignmentQuestionThreadsInput> {
    /**
     * Executes the assignment threads get process.
     * @param input - The input data for getting assignment threads, validated by getAssignmentQuestionThreadsSchema.
     * @returns A promise resolving to an object with a list of threads.
     * @throws {ApiError} If the assignment with the given id is not found.
     */
    async execute(input: GetAssignmentQuestionThreadsInput): Promise<object> {
        const threads: QuestionThread[] = await tryRepoEntityOperation(
            this.questionThreadRepository.getByAssignmentId(input.idParent),
            "Assignment",
            input.idParent,
            true,
        );
        return { threads: threads.map(qt => qt.id) };
    }
}
