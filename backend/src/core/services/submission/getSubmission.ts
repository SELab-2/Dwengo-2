import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { getSubmissionSchema, getUserSubmissionsSchema } from "../../../application/schemas/submissionSchemas";

export type GetSubmissionInput = z.infer<typeof getSubmissionSchema>;

export class GetSubmission extends SubmissionBaseService<GetSubmissionInput> {
    async execute(input: GetSubmissionInput): Promise<object> {
        const submission = await this.submissionRepository.getById(input.id);
        return { id: submission.id };
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
