import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { tryRepoEntityOperation } from "../../helpers";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

export type GetSubmissionActivitySchema = z.infer<typeof getProgressSchema>;

export class GetSubmissionActivity implements Service<GetSubmissionActivitySchema> {
    constructor(private _submissionRepository: ISubmissionRepository) {}

    public async execute(input: GetSubmissionActivitySchema): Promise<object> {
        // Get all the submissions for a class NOT older than 1 year
        const submissions: number[] = await tryRepoEntityOperation(
            this._submissionRepository.getMonthlySubmissionCounts(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        return { submissions };
    }
}
