import { z } from "zod";
import { QuestionThreadService } from "./questionThreadService";
import { createQuestionThreadSchema } from "../../../application/schemas/questionThreadSchemas";
import { QuestionThread } from "../../entities/questionThread";
import { tryRepoEntityOperation } from "../../helpers";

export type CreateQuestionThreadInput = z.infer<typeof createQuestionThreadSchema>;

export class CreateQuestionThread extends QuestionThreadService<CreateQuestionThreadInput> {
    /**
     * Executes the thread creation process.
     * @param input - The input data for creating a thread, validated by createQuestionThreadSchema.
     * @returns A promise resolving to an object containing the ID of the created thread.
     * @throws {ApiError} If the given user, assignment, learning-object or messages are not found or if the creation fails.
     */
    async execute(input: CreateQuestionThreadInput): Promise<object> {
        const questionThread = new QuestionThread(
            input.creatorId,
            input.assignmentId,
            input.learningObjectId,
            input.isClosed,
            input.visibility,
            [],
            undefined,
        );

        const createdThread = await tryRepoEntityOperation(
            this.questionThreadRepository.create(questionThread),
            "User | Assignment | LearningObject | Message",
            `${questionThread.creatorId} | ${questionThread.assignmentId} | ${questionThread.learningObjectId} | ${questionThread.messageIds}`,
        );

        return { id: createdThread.id };
    }
}
