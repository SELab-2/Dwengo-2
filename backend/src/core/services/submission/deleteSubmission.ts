import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { deleteSubmissionSchema } from "../../../application/schemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteSubmissionInput = z.infer<typeof deleteSubmissionSchema>;

export class DeleteSubmission extends SubmissionBaseService<DeleteSubmissionInput> {
    /**
     * Executes the submission deletion process.
     * @param input - The input data for deleting a submission, validated by deleteSubmissionSchema.
     * @returns An empty object.
     * @throws {ApiError} If the submission with the given id is not found.
     */
    async execute(input: DeleteSubmissionInput): Promise<object> {
        await tryRepoEntityOperation(this.submissionRepository.delete(input.id), "Submission", input.id, true);
        return {};
    }
}
