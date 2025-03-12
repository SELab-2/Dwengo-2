import { Service, ServiceParams } from '../../../config/service';
import { UserType } from '../../entities/user';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';

/**
 * Delete a user from the DB.
 */

export class DeleteUserParams implements ServiceParams {
  constructor(private _id: string, private _userType: UserType) {}

  public get id(): string {
    return this._id;
  }

  public get userType(): string {
    return this._userType;
  }
}

export abstract class DeleteUser implements Service<DeleteUserParams> {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {}
  /**
   * Delete a student from the DB.
   * @param params Parameters containing the ID of the user to delete.
   * @returns void
   * @throws Error if the user that will be deleted does not exist.
   */
  async execute(input: DeleteUserParams): Promise<object> {
    if (input.userType == UserType.STUDENT) {
      await this.studentRepository.deleteStudentById(input.id);
    } else {
      await this.teacherRepository.deleteTeacherWithId(input.id);
    }
    return {};
  }
}
