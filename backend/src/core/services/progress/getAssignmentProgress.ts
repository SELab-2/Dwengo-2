import { z } from "zod";
import { getProgressSchema } from "../../../application/schemas";
import { ProgressBaseService } from "./progressBaseService";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";

export type GetAssignmentProgressInput = z.infer<typeof getProgressSchema>;

export class GetAssignmentProgress extends ProgressBaseService<GetAssignmentProgressInput> {
    constructor(
            submissionRepository: ISubmissionRepository,
            assignmentRepository: IAssignmentRepository,
            learningPathRepository: ILearningPathRepository,
        ) {super(submissionRepository, assignmentRepository, learningPathRepository)}  
    async execute(input: GetAssignmentProgressInput): Promise<object> {
        throw new Error("GetAssignmentProgress is not implemented yet.");
        return {};
    }
}