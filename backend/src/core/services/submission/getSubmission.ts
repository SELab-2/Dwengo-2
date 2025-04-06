import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { getSubmissionSchema } from "../../../application/schemas/submissionSchemas";
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

// TODO - don't forget to add the try after PR is resolved
// TODO export type GetUsertSubmissionsInput = z.infer<typeof getUserSubmissionsSchema>;
//
// TODO export class GetUserSubmissions extends SubmissionBaseService<GetUsertSubmissionsInput> {
//          TODO
//          async execute(input: GetUsertSubmissionsInput): Promise<object> {
//              const students: object[] = (await this.submissionRepository.getAssignmentStudents(input.assignmentId)).map(s =>
//                  s.toObject(),
//              );
//              return { students: students };
//          }
//      }
//
