import { Service, ServiceParams } from "../../../config/service";
import { IAssignmentRepository } from "../../repositories/assignmentRepositoryInterface";

/**
 * Wrapper class for the input parameters of the GetAssignment service.
 */
export class GetAssignmentParams implements ServiceParams {
    public constructor(private _id: string) {}

    public get id(): string {
        return this._id;
    }
}

/**
 * Service class to get an assignment.
 */
export class GetAssignment implements Service<GetAssignmentParams> {
    public constructor(private assignmentRepository: IAssignmentRepository) {}

    async execute(input: GetAssignmentParams): Promise<object> {
        return (await this.assignmentRepository.getAssignmentById(input.id)).toObject();
    }
}
