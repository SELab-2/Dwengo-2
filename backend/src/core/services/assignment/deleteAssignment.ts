import { AssignmentService } from "./assignmentService";
import { ServiceParams } from "../../../config/service";

/**
 * Wrapper class for the input parameters of the DeleteAssignment service.
 */
export class DeleteAssignmentParams implements ServiceParams {
    public constructor(private _id: string) {}

    public get id(): string {
        return this._id;
    }
}

/**
 * Service class to delete an assignment.
 */
export class DeleteAssignment extends AssignmentService<DeleteAssignmentParams> {
    async execute(input: DeleteAssignmentParams): Promise<object> {
        await this.assignmentRepository.delete(input.id);
        return {};
    }
}
