import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { createSubmissionSchema } from "../../../application/schemas/submissionSchemas";
import { Submission } from "../../entities/submission";

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export class CreateSubmission extends SubmissionBaseService<CreateSubmissionInput> {
    async execute(input: CreateSubmissionInput): Promise<object> {
        const submission = new Submission(
            input.studentId,
            input.assignmentId,
            input.learningObjectId,
            input.time,
            Buffer.from(input.contents, "utf8"),
            input.status,
        );

        return { id: await this.submissionRepository.create(submission) };
    }
}
