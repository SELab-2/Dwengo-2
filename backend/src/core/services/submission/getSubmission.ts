import { z } from "zod";
import { SubmissionBaseService } from "./submissionBaseService";
import { getSubmissionSchema } from "../../../application/schemas/submissionSchemas";

export type GetSubmissionInput = z.infer<typeof getSubmissionSchema>;

export class GetSubmission extends SubmissionBaseService<GetSubmissionInput> {
    async execute(input: GetSubmissionInput): Promise<object> {
        const submission = await this.submissionRepository.getById(input.id);
        return { id: submission.id };
    }
}

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
