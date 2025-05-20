import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { Service } from "../../../config/service";
import { Assignment } from "../../entities/assignment";
import { StatusType, Submission } from "../../entities/submission";
import { tryRepoEntityOperation } from "../../helpers";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

export type GetClassScoreInput = z.infer<typeof getProgressSchema>;

export class GetClassScore implements Service<GetClassScoreInput> {
    constructor(
        private _submissionRepository: ISubmissionRepository,
        private _assignmentRepository: IAssignmentRepository,
    ) {}

    public async execute(_userId: string, input: GetClassScoreInput): Promise<object> {
        // Get all users in the class
        const assignments: Assignment[] = await tryRepoEntityOperation(
            this._assignmentRepository.getByClassId(input.idParent),
            "Class",
            input.idParent,
            true,
        );
        let total: number = 0;
        let approved: number = 0;

        // Get all the submissions of the class
        for (const a of assignments) {
            // Get submissions
            const submissions: Submission[] = await tryRepoEntityOperation(
                this._submissionRepository.getAllForAssignment(a.id!),
                "assignment",
                a.id!,
                true,
            );

            // Update total amount of submissions in this class
            total += submissions.length;

            // Update the total amount of "correct" submission
            approved += submissions.filter((v: Submission) => v.status === StatusType.ACCEPTED).length;
        }

        // No submissions/assignments => return null to avoid NaN
        if (total === 0) {
            return { score: null };
        }

        // Return the score rounded with two decimals precision
        const score: number = Math.round((approved / total) * 10000) / 100;
        return { score };
    }
}
