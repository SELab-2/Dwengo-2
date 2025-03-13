import { Service, ServiceParams } from "../../../config/service";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

export abstract class SubmissionBaseService<T extends ServiceParams> implements Service<T> {
    constructor(protected submissionRepository: ISubmissionRepository) {}
    abstract execute(input: T): Promise<object>;
}
