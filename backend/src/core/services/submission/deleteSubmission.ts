import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { deleteSubmissionSchema } from "../../../application/schemas";

export type DeleteSubmissionInput = z.infer<typeof deleteSubmissionSchema>;

export class DeleteSubmission extends SubmissionBaseService<DeleteSubmissionInput> {
    async execute(input: DeleteSubmissionInput): Promise<object> {
        await this.submissionRepository.delete(input.id);
        return {};
    }
}
