import { ServiceParams } from "../../../config/service";
import { AssignmentService } from "./assignmentService";

export class DeleteAssignmentParams implements ServiceParams {
  public constructor(
    private _id: string
  ){}

  public get id(): string {
    return this._id;
  }
}

export class DeleteAssignment extends AssignmentService<DeleteAssignmentParams> {

  async execute(input: DeleteAssignmentParams): Promise<object> {
    await this.assignmentRepository.deleteAssignmentById(input.id);
    return {};
  }
}
