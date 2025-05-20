import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { createSubmissionSchema } from "../../../application/schemas/submissionSchemas";
import { Submission } from "../../entities/submission";
import { tryRepoEntityOperation } from "../../helpers";

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export class CreateSubmission extends SubmissionBaseService<CreateSubmissionInput> {
    /**
     * Executes the submission creation process.
     * @param input - The input data for creating a submission, validated by createSubmissionSchema.
     * @returns A promise resolving to an object containing the ID of the created submission.
     * @throws {ApiError} If the given user, assignment, learning-object or messages are not found or if the creation fails.
     */
    async execute(_userId: string, input: CreateSubmissionInput): Promise<object> {
        const submission = new Submission(
            input.studentId,
            input.assignmentId,
            input.taskId,
            input.learningObjectId,
            input.time,
            Buffer.from(input.contents, "utf8"),
            input.status,
        );

        const createdSubmission = await tryRepoEntityOperation(
            this.submissionRepository.create(submission),
            "Student | Assignment | Task | LearningObject",
            `${submission.studentId} | ${submission.assignmentId} | ${submission.taskId} | ${submission.learningObjectId}`,
            true,
        );

        return { id: createdSubmission };
    }
}
