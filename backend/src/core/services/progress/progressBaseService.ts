import { Service } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

export abstract class ProgressBaseService<T> implements Service<T> {
    constructor(
        protected submissionRepository: ISubmissionRepository,
        protected assignmentRepository: IAssignmentRepository,
        protected learningPathRepository: ILearningPathRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
