import { AssignmentService } from "./assignmentService";
import { ServiceParams } from "../../../config/service";
import { Assignment } from "../../entities/assignment";

/**
 * Wrapper class for the parameters of the UpdateAssignment service.
 */
export class UpdateAssignmentParams implements ServiceParams {
    public constructor(
        private _id: string,
        private _classId?: string,
        private _learningPathId?: string,
        private _startDate?: Date,
        private _deadline?: Date,
        private _extraInstructions?: string,
    ) {}

    public get id(): string {
        return this._id;
    }

    public get classId(): string | undefined {
        return this._classId;
    }

    public get learningPathId(): string | undefined {
        return this._learningPathId;
    }

    public get startDate(): Date | undefined {
        return this._startDate;
    }

    public get deadline(): Date | undefined {
        return this._deadline;
    }

    public get extraInstructions(): string | undefined {
        return this._extraInstructions;
    }
}

/**
 * Service that updates an assignment.
 */
export class UpdateAssignment extends AssignmentService<UpdateAssignmentParams> {
    async execute(input: UpdateAssignmentParams): Promise<object> {
        const updatedFields: Partial<Assignment> = {};

        if (input.classId) updatedFields.classId = input.classId;
        if (input.learningPathId) updatedFields.learningPathId = input.learningPathId;
        if (input.startDate) updatedFields.startDate = input.startDate;
        if (input.deadline) updatedFields.deadline = input.deadline;
        if (input.extraInstructions) updatedFields.extraInstructions = input.extraInstructions;

        return (await this.assignmentRepository.updateAssignmentById(input.id, updatedFields)).toObject();
    }
}
