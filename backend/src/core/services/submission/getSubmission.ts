import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { getSubmissionSchema, getUserSubmissionsSchema } from "../../../application/schemas/submissionSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type GetSubmissionInput = z.infer<typeof getSubmissionSchema>;

export class GetSubmission extends SubmissionBaseService<GetSubmissionInput> {
    /**
     * Executes the submission get process.
     * @param input - The input data for getting a submission, validated by getSubmissionSchema.
     * @returns A promise resolving to a submission transformed into an object.
     * @throws {ApiError} If the submission with the given id was not found.
     */
    async execute(input: GetSubmissionInput): Promise<object> {
        return (
            await tryRepoEntityOperation(this.submissionRepository.getById(input.id), "Submission", input.id, true)
        ).toObject();
    }
}

export type GetUserSubmissionsInput = z.infer<typeof getUserSubmissionsSchema>;

export class GetUserSubmissions extends SubmissionBaseService<GetUserSubmissionsInput> {
    async execute(input: GetUserSubmissionsInput): Promise<object> {
        const submissions: string[] = (
            input.assignmentId && input.learningObjectId
                ? await this.submissionRepository.getAllForStudentInAssignmentStep(
                      input.idParent,
                      input.assignmentId,
                      input.learningObjectId,
                  )
                : await this.submissionRepository.getByStudentId(input.idParent)
        ).map(submission => submission.id!);
        return { submisisons: submissions };
    }
}
