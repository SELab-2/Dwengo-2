import { Service } from "../../../config/service";
import { ISubmissionRepository } from "../../repositories/submissionRepositoryInterface";

/**
 * Base class for submission services.
 */
export abstract class SubmissionBaseService<T> implements Service<T> {
    constructor(protected submissionRepository: ISubmissionRepository) {}
    abstract execute(input: T): Promise<object>;
}
