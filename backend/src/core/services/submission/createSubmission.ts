import { ServiceParams } from "../../../config/service";
import { Submission, StatusType } from "../../entities/submission";
import { SubmissionBaseService } from "./submissionBaseService";

export class CreateSubmissionParams implements ServiceParams {
    constructor(
        private _studentId: string,
        private _assignmentId: string,
        private _learningObjectId: string,
        private _time: Date,
        private _contents: Buffer,
        private _status: StatusType = StatusType.NOT_ACCEPTED,
    ) { }

    // Getters
    public get studentId(): string {
        return this._studentId;
    }
    public get assignmentId(): string {
        return this._assignmentId;
    }
    public get learningObjectId(): string {
        return this._learningObjectId;
    }
    public get time(): Date {
        return this._time;
    }
    public get contents(): Buffer {
        return this._contents;
    }
    public get status(): StatusType {
        return this._status;
    }
}

export class CreateSubmission extends SubmissionBaseService<CreateSubmissionParams> {
    async execute(input: CreateSubmissionParams): Promise<object> {
        const submission = new Submission(
            input.studentId,
            input.assignmentId,
            input.learningObjectId,
            input.time,
            input.contents,
            input.status
        );

        return { id: (await this.submissionRepository.create(submission)) };
    }
}
