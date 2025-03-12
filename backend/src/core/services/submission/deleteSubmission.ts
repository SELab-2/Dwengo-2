import { ServiceParams } from "../../../config/service";
import { SubmissionBaseService } from "./submissionBaseService";

export class DeleteSubmissionParams implements ServiceParams {
    constructor(private _id: string) { }

    public get id(): string {
        return this._id;
    }
}

export class DeleteSubmission extends SubmissionBaseService<DeleteSubmissionParams> {
    async execute(input: DeleteSubmissionParams): Promise<object> {
        await this.submissionRepository.delete(input.id);
        return {};
    }
}
