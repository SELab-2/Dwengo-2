import { AssignmentService } from "./assignmentService";
import { ServiceParams } from "../../../config/service";
import { Assignment } from "../../entities/assignment";

export class GetUserAssignmentsParams implements ServiceParams {
    public constructor(private _id: string) {}

    public get id() {
        return this._id;
    }
}

export class GetUserAssignments extends AssignmentService<GetUserAssignmentsParams> {
    async execute(input: GetUserAssignmentsParams): Promise<object> {
        const assignments: Assignment[] = await this.assignmentRepository.getAssignmentsByUserId(input.id);
        return { assignments: assignments.map(assignment => assignment.toObject()) };
    }
}
