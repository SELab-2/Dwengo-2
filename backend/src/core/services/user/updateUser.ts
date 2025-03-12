import { Service, ServiceParams } from '../../../config/service';
import { Student } from '../../entities/student';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { User, UserType } from '../../entities/user';
import { Teacher } from '../../entities/teacher';

/**
 * Class to be used by execute method to update a user's info in the DB.
 * If a field is not to be updated, it should be undefined in the constructor.
 */
export class UpdateParams implements ServiceParams {
  constructor(
    private _id: string,
    private _userType: UserType,
    private _email?: string,
    private _firstName?: string,
    private _familyName?: string,
    private _passwordHash?: string,
    private _schoolName?: string,
  ) {}

  get userType() {
    return this._userType;
  }

  /**
   * Updates an object with updated fields of a user.
   *
   * @param studentRepository repository to get student info from DB.
   * @param teacherRepository repository to get teacher info from DB.
   * @returns a student object with the updated info.
   * @throws ApiError if the email or password is the same as the old one
   * or if the email is already in use.
   *
   */
  async fromObject(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ): Promise<User> {
    // Get the old info of the user
    let oldUser: User;
    if (this._userType == UserType.STUDENT) {
      oldUser = await studentRepository.getStudentById(this._id);
    } else {
      oldUser = await teacherRepository.getTeacherById(this._id);
    }

    // Check if email is not same when being updated
    if (this._email && oldUser.email === this._email) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Email cannot be the same as old one.',
      } as ApiError;
    }

    // Check if email is already in use
    if (this._email) {
      const studentPresent: boolean = await studentRepository.checkByEmail(
        this._email,
      );
      const teacherPresent: boolean =
        await teacherRepository.checkTeacherByEmail(this._email);
      if (studentPresent || teacherPresent) {
        throw {
          code: ErrorCode.BAD_REQUEST,
          message: 'Email already in use.',
        } as ApiError;
      }
    }

    // Check if password is not same when being updated
    if (this._passwordHash && oldUser.passwordHash === this._passwordHash) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Password cannot be the same as old one.',
      } as ApiError;
    }

    if (this._userType == UserType.STUDENT) {
      return new Student(
        this._email ?? oldUser.email,
        this._firstName ?? oldUser.firstName,
        this._familyName ?? oldUser.familyName,
        this._passwordHash ?? oldUser.passwordHash,
        this._schoolName ?? oldUser.schoolName,
        this._id,
      );
    }
    return new Teacher(
      this._email ?? oldUser.email,
      this._firstName ?? oldUser.firstName,
      this._familyName ?? oldUser.familyName,
      this._passwordHash ?? oldUser.passwordHash,
      this._schoolName ?? oldUser.schoolName,
      this._id,
    );
  }
}

/**
 * Abstract class for updating a user.
 * @param studentRepository - Repository for student data.
 * @param teacherRepository - Repository for teacher data.
 */
export abstract class UpdateUser implements Service<UpdateParams> {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  /**
   * Executes the update operation.
   *
   * @param input - Parameters containing the updated user info.
   * @returns An empty object.
   */
  async execute(input: UpdateParams): Promise<object> {
    const user: User = await input.fromObject(
      this.studentRepository,
      this.teacherRepository,
    );
    if (input.userType == UserType.STUDENT) {
      await this.studentRepository.updateStudent(user as Student);
    } else {
      await this.teacherRepository.updateTeacher(user as Teacher);
    }

    return {};
  }
}
