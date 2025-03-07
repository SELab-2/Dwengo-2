import { StudentRepositoryInterface } from '../../repositories/studentRepositoryInterface';
import { RemoveStudentFrom } from './removeStudentFrom';

// Class used to remove a student from a class.
export class RemoveStudentFromClass extends RemoveStudentFrom {
  constructor(studentRepository: StudentRepositoryInterface) {
    super(studentRepository);
  }

  /**
   * Function for removing student from a class.
   *
   * @param studentId id of the student to be removed.
   * @param otherId id of the class where to be removed from.
   *
   * @returns void.
   */
  public async removeStudent(
    studentId: string,
    otherId: string,
  ): Promise<void> {
    await this.studentRepository.removeStudentFromClass(studentId, otherId);
  }
}
