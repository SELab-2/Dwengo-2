import { ServiceParams } from '../../../config/service';
import { Assignment } from '../../entities/assignment';
import { AssignmentService } from './assignmentService';

export class CreateAssignmentParams implements ServiceParams {
  public constructor (
    private _classId: string,
    private _learningPathId: string,
    private _startDate: Date,
    private _deadline: Date,
    private _extraInstructions: string,
    private _teacherId: string
  ){}

  public get classId(): string{
    return this._classId;
  }

  public get learningPathId(): string{
    return this._learningPathId;
  }

  public get startDate(): Date{
    return this._startDate;
  }

  public get deadline(): Date{
    return this._deadline;
  }

  public get extraInstructions(): string{
    return this._extraInstructions;
  }

  public get teacherId(): string {
    return this._teacherId;
  }

}

export class CreateAssignment extends AssignmentService<CreateAssignmentParams> {

  async execute(input: CreateAssignmentParams): Promise<object> {
    const assigment: Assignment = new Assignment(
      input.classId,
      input.learningPathId,
      input.startDate,
      input.deadline,
      input.extraInstructions
    );
    return (await this.assignmentRepository.createAssignment(assigment, input.teacherId)).toObject();
  }
}
