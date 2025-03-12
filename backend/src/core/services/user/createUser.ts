import { Service, ServiceParams } from '../../../config/service';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { User, UserType } from '../../entities/user';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { Student } from '../../entities/student';
import { Teacher } from '../../entities/teacher';

/**
 * @template T the type of user.
 * @class CreateParams
 * @description class representing the parameters required to create a user.
 */
export class CreateParams implements ServiceParams {
  constructor(
    private _email: string,
    private _firstName: string,
    private _familyName: string,
    private _passwordHash: string,
    private _schoolName: string,
    private _userType: UserType,
  ) {}

  get userType() {
    return this._userType;
  }

  /**
   * @description Creates a user object from the provided info and checks if info is valid.
   * @param {StudentRepositoryInterface} studentRepository - The student repository.
   * @param {ITeacherRepository} teacherRepository - The teacher repository.
   *
   * @returns {Promise<T>} The created user.
   * @throws {ApiError} If the email is invalid or already in use.
   */
  public async fromObject(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ): Promise<User> {
    // Check email
    if (!this._email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email)) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Email invalid.',
      } as ApiError;
    }

    // Check if email not already in use
    const studentPresent: boolean = await studentRepository.checkByEmail(
      this._email,
    );
    const teacherPresent: boolean = await teacherRepository.checkTeacherByEmail(
      this._email,
    );
    if (studentPresent || teacherPresent) {
      throw {
        code: ErrorCode.CONFLICT,
        message: 'Email already in use.',
      } as ApiError;
    }
    if (this.userType == UserType.STUDENT) {
      return new Student(
        this._email,
        this._firstName,
        this._familyName,
        this._passwordHash,
        this._schoolName,
      );
    } else {
      return new Teacher(
        this._email,
        this._firstName,
        this._familyName,
        this._passwordHash,
        this._schoolName,
      );
    }
  }
}

/**

 * @description Class representing the service for creating a user.
 * @param {StudentRepositoryInterface} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class CreateUser implements Service<CreateParams> {
  public constructor(
    protected studentRepository: IStudentRepository,
    protected teacherRepository: ITeacherRepository,
  ) {}

  /**
   * @description Executes the use case to create a user.
   * @param input - The input parameters to create a user.
   * @returns {Promise<object>} An object containing the ID of the created user.
   */
  async execute(input: CreateParams): Promise<object> {
    const user: User = await input.fromObject(
      this.studentRepository,
      this.teacherRepository,
    );
    const createdUser: User =
      input.userType == UserType.STUDENT
        ? await this.studentRepository.createStudent(user as Student)
        : await this.teacherRepository.createTeacher(user as Teacher);
    return { id: createdUser.id! };
  }
}
