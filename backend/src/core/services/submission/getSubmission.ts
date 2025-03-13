import { SubmissionBaseService } from "./submissionBaseService";
import { ServiceParams } from "../../../config/service";

export class GetSubmissionParams implements ServiceParams {
    constructor(private _id: string) {}

    public get id(): string {
        return this._id;
    }
}

export class GetSubmission extends SubmissionBaseService<GetSubmissionParams> {
    async execute(input: GetSubmissionParams): Promise<object> {
        return (await this.submissionRepository.getById(input.id)).toObject();
    }
}
