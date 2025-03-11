import { Service, ServiceParams } from '../../../config/service';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';

// Class to be used by execute methode
export class RemoveStudentFromParams implements ServiceParams {
  constructor(private _studentId: string, private _otherId: string) {}

  get studentId() {
    return this._studentId;
  }

  get otherId() {
    return this._otherId;
  }
}

// Abstract class for RemoveStudentFromGroup and RemoveStudentFromClass
export abstract class RemoveStudentFrom
  implements Service<RemoveStudentFromParams>
{
  public constructor(protected studentRepository: IStudentRepository) {}

  /**
   * Function that calls the right method of repository.
   *
   * @param studentId id of student to be removed.
   * @param otherId id of group/class.
   */
  abstract removeStudent(studentId: string, otherId: string): void;

  /**
   * Removes a student from a group/class.
   *
   * @param input object containing studentId and otherId.
   * @returns empty object no extra info needed.
   *
   */
  async execute(input: RemoveStudentFromParams): Promise<object> {
    await this.removeStudent(input.studentId, input.otherId);
    return {};
  }
}
