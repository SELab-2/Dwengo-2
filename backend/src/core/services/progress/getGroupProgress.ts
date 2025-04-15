import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { ProgressBaseService } from "./progressBaseService";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";

export type GetGroupProgressInput = z.infer<typeof getProgressSchema>;

export class GetGroupProgress extends ProgressBaseService<GetGroupProgressInput> {
    constructor(
            submissionRepository: ISubmissionRepository,
            assignmentRepository: IAssignmentRepository,
            learningPathRepository: ILearningPathRepository,
        ) {super(submissionRepository, assignmentRepository, learningPathRepository)}  
    async execute(input: GetGroupProgressInput): Promise<object> {
        throw new Error("GetGroupProgress is not implemented yet.");
        return {};
    }
}