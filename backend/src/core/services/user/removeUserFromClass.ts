import { UserType } from '../../entities/user';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { RemoveUserFrom } from './removeUserFrom';

export class RemoveUserFromClass extends RemoveUserFrom {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {
    super();
  }
  public async removeUser(
    userId: string,
    otherId: string,
    userType: UserType,
  ): Promise<void> {
    if (userType == UserType.STUDENT) {
      await this.studentRepository.removeStudentFromClass(userId, otherId);
    } else {
      await this.teacherRepository.deleteTeacherFromClass(userId, otherId);
    }
  }
}
