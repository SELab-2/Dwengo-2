import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { getSubmissionSchema, getUserSubmissionsSchema } from "../../../application/schemas/submissionSchemas";
import { ApiError, ErrorCode } from "../../../application/types";
import { Submission } from "../../entities/submission";
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
    /**
     * Get all the submissions for a user.
     * Get all the submissions for a user in a specific assignment.
     * Get all the submissions for a user in a specific assignment and step.
     *
     * @param input - The input data for getting a submission, validated by getUserSubmissionsSchema.
     * @returns A promise resolving to an object containing an array with the IDs of the submissions.
     * @throws {ApiError} If the assignmentId is not provided when learningObjectId is provided.
     */
    async execute(input: GetUserSubmissionsInput): Promise<object> {
        let submissions: Submission[];
        // Check when learninObjectId is provided the assignmentId is also provided
        if (!input.assignmentId && input.taskId) {
            throw {
                code: ErrorCode.BAD_REQUEST,
                message: "Can only request submissions for a user inside of an assignment.",
            } as ApiError;
        }

        if (input.assignmentId) {
            if (!input.taskId) {
                // Get the submissions for an assingment from a user
                submissions = await tryRepoEntityOperation(
                    this.submissionRepository.getAllForStudentInAssignment(input.idParent, input.assignmentId),
                    "User | Assignment",
                    `${input.idParent} | ${input.assignmentId}`,
                    true,
                );
            } else {
                // Get the submissions for an assingment from a user in a specific step
                submissions = await tryRepoEntityOperation(
                    this.submissionRepository.getAllForStudentInAssignmentStep(
                        input.idParent,
                        input.assignmentId,
                        input.taskId,
                    ),
                    "User | Assignment | Task",
                    `${input.idParent} | ${input.assignmentId} | ${input.taskId}`,
                    true,
                );
            }
        } else {
            // Get all the submissions for a user
            submissions = await tryRepoEntityOperation(
                this.submissionRepository.getByStudentId(input.idParent),
                "User",
                input.idParent,
                true,
            );
        }

        return { submissions: submissions.map(submission => submission.id!) };
    }
}
