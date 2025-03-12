import { Service, ServiceParams } from "../../../config/service";
import { Assignment } from "../../entities/assignment";
import { AssignmentService } from "./assignmentService";

export class UpdateAssignmentParams implements ServiceParams {
  public constructor(
    private _id: string,
    private _classId?: string,
    private _learningPathId?: string,
    private _startDate?: Date,
    private _deadline?: Date,
    private _extraInstructions?: string,
  ){}

  public get id(): string {
    return this._id;
  }

  public get classId(): string | undefined{
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

export class UpdateAssignment extends AssignmentService<UpdateAssignmentParams> {

  async execute(input: UpdateAssignmentParams): Promise<object> {
    const updatedFields: Partial<Assignment> = Object.fromEntries(
      Object.entries({
        classId: input.classId,
        learningPathId: input.learningPathId,
        startDate: input.startDate,
        deadline: input.deadline,
        extraInstructions: input.extraInstructions,
      }).filter(([_, value]) => value !== undefined)
    );
    return (await this.assignmentRepository.updateAssignmentById(input.id, updatedFields)).toObject;
  }
}
