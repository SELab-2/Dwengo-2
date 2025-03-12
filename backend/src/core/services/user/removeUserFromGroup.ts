import { ApiError, ErrorCode } from '../../../application/types';
import { UserType } from '../../entities/user';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { RemoveUserFrom } from './removeUserFrom';

export class RemoveUserFromGroup extends RemoveUserFrom {
  constructor(private studentRepository: IStudentRepository) {
    super();
  }

  public async removeUser(
    userId: string,
    otherId: string,
    userType: UserType,
  ): Promise<void> {
    if (userType == UserType.STUDENT) {
      await this.studentRepository.removeStudentFromGroup(userId, otherId);
    } else {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Only students can be part of a group.',
      } as ApiError;
    }
  }
}
