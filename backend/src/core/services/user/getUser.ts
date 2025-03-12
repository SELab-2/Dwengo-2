import { ApiError, ErrorCode } from '../../../application/types';
import { Service, ServiceParams } from '../../../config/service';
import { Student } from '../../entities/student';
import { Teacher } from '../../entities/teacher';
import { User, UserType } from '../../entities/user';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';

export class GetUserParams implements ServiceParams {
  constructor(private _id: string, private _userType: UserType) {}

  public get id() {
    return this._id;
  }

  public get userType() {
    return this._userType;
  }
}

/**
 * Abstract class to get a student/teacher from DB
 */
export class GetUser implements Service<GetUserParams> {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {}
  /**
   * Gets a user from the DB.
   *
   * @param id ID of the user to get from the DB.
   * @returns the student with the given id.
   *
   * @throws ApiError if id is invalid.
   */
  async execute(input: GetUserParams): Promise<object> {
    const user: User = input.userType === UserType.STUDENT
      ? await this.studentRepository.getStudentById(input.id)
      : await this.teacherRepository.getTeacherById(input.id);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      familyName: user.familyName,
      schoolName: user.schoolName,
    };
  }
}
