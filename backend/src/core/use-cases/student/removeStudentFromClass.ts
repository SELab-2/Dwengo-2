import { UseCase } from '../../../config/usecase';
import { StudentRepositoryInterface } from '../../repositories/studentRepositoryInterface';

interface RemoveStudentID {
  studentId: string;
  classId: string;
}


// Class to be used by execute method.
export class RemoveStudentParams {
  private studentId: string;
  private classId: string;
  constructor(studentId: string, classId: string) {
    this.studentId = studentId;
    this.classId = classId;
  }

  /**
   * Function that gives back an object containing studentId and classId
   *  
   * @returns object containing the studentId and classId
   */
  fromObject(): RemoveStudentID {
    return { studentId: this.studentId, classId: this.classId };
  }
}

export class RemoveStudentFromClass
  implements UseCase<RemoveStudentParams, object>
{
  public constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Removes a student from a class.
   *
   * @param input RemoveStudentParams object containing studentId and classId
   * @returns empty object no extra info needed
   */
  async execute(input: RemoveStudentParams): Promise<object> {
    const id: RemoveStudentID = input.fromObject();
    await this.studentRepository.removeStudentFromClass(
      id.studentId,
      id.classId,
    );
    return {};
  }
}
