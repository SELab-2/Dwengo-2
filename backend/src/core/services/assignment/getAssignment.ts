import { Service, ServiceParams } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

export class GetAssignmentParams implements ServiceParams {
    public constructor(private _id: string) {}

    public get id(): string {
        return this._id;
    }
}

export class GetAssignment implements Service<GetAssignmentParams> {
    public constructor(private assignmentRepository: IAssignmentRepository) {}

    async execute(input: GetAssignmentParams): Promise<object> {
        return (await this.assignmentRepository.getAssignmentById(input.id)).toObject();
    }
}

export class GetGroupAssignmentParams implements ServiceParams {
    public constructor(private _groupId: string) {}

    public get groupId(): string {
        return this._groupId;
    }
}
