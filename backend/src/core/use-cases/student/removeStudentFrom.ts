import { UseCase } from '../../../config/usecase';
import { StudentRepositoryInterface } from '../../repositories/studentRepositoryInterface';

interface RemoveStudentID {
  studentId: string;
  otherId: string;
}

// Class to be used by execute methode
export class RemoveStudentFromParams {
  private studentId: string;
  private otherId: string;
  constructor(studentId: string, otherId: string) {
    this.studentId = studentId;
    this.otherId = otherId;
  }

  /**
   * Function that gives back an object containing studentId and otherId.
   *
   * @returns object containing the studentId and otherId to remove student.
   */
  public fromObject(): RemoveStudentID {
    return { studentId: this.studentId, otherId: this.otherId };
  }
}

// Abstract class for RemoveStudentFromGroup and RemoveStudentFromClass
export abstract class RemoveStudentFrom
  implements UseCase<RemoveStudentFromParams, object>
{
  public constructor(protected studentRepository: StudentRepositoryInterface) {}

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
    const id: RemoveStudentID = input.fromObject();
    await this.removeStudent(id.studentId, id.otherId);
    return {};
  }
}
