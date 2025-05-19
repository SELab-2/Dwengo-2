import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { updateSubmissionSchema } from "../../../application/schemas";
import { tryRepoEntityOperation } from "../../helpers";

export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;

export class UpdateSubmission extends SubmissionBaseService<UpdateSubmissionInput> {
    /**
     * Executes the submission deletion process.
     * @param input - The input data for deleting a submission, validated by updateSubmissionSchema.
     * @returns An empty object.
     * @throws {ApiError} If the submission with the given id is not found.
     */
    async execute(input: UpdateSubmissionInput): Promise<object> {
        await tryRepoEntityOperation(
            this.submissionRepository.update(input.id, input.status),
            "Submission",
            input.id,
            true,
        );
        return {};
    }
}
