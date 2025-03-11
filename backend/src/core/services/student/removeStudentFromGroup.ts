import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { RemoveStudentFrom } from './removeStudentFrom';

// Class used to remove a student from a group.
export class RemoveStudentFromGroup extends RemoveStudentFrom {
  constructor(studentRepository: IStudentRepository) {
    super(studentRepository);
  }

  /**
   * Function for removing student from a group.
   *
   * @param studentId id of the student to be removed.
   * @param otherId id of the group where to be removed from.
   *
   * @returns void.
   */
  public async removeStudent(
    studentId: string,
    otherId: string,
  ): Promise<void> {
    await this.studentRepository.removeStudentFromGroup(studentId, otherId);
  }
}
