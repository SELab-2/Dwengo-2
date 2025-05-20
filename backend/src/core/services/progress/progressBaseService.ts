import { Service } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../repositories/learningPathRepositoryInterface";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";
import { IUserRepository } from "../../repositories/userRepositoryInterface";

export abstract class ProgressBaseService<T> implements Service<T> {
    constructor(
        protected submissionRepository: ISubmissionRepository,
        protected assignmentRepository: IAssignmentRepository,
        protected learningPathRepository: ILearningPathRepository,
        protected userRepository: IUserRepository,
    ) {}
    abstract execute(userId: string, input: T): Promise<object>;
}
