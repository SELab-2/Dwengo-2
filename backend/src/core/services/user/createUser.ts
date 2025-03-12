import { Service, ServiceParams } from '../../../config/service';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { User } from '../../entities/user';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { Student } from '../../entities/student';
import { Teacher } from '../../entities/teacher';

/**
 * @template T the type of user.
 * @class CreateParams
 * @description Abstract class representing the parameters required to create a user.
 */
export abstract class CreateParams<T extends User> implements ServiceParams {
  protected email: string;
  protected firstName: string;
  protected familyName: string;
  protected passwordHash: string;
  protected schoolName: string;

  constructor(
    email: string,
    firstName: string,
    familyName: string,
    passwordHash: string,
    schoolName: string,
  ) {
    this.email = email;
    this.firstName = firstName;
    this.familyName = familyName;
    this.passwordHash = passwordHash;
    this.schoolName = schoolName;
  }

  /**
   * @description Abstract method to create a user object.
   * @returns {T} The created user.
   */
  abstract createUser(): T;

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
  ): Promise<T> {
    // Check email
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Email invalid.',
      } as ApiError;
    }

    // Check if email not already in use
    const studentPresent: boolean = await studentRepository.checkByEmail(
      this.email,
    );
    const teacherPresent: boolean = await teacherRepository.checkTeacherByEmail(
      this.email,
    );
    if (studentPresent || teacherPresent) {
      throw {
        code: ErrorCode.CONFLICT,
        message: 'Email already in use.',
      } as ApiError;
    }
    return this.createUser();
  }
}

/**
 * @template T The type of user to be created.
 * @template P The corresponding type of params to be used.
 * @implements {Service<P>}
 * @description Abstract class representing the service for creating a user.
 * @param {StudentRepositoryInterface} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export abstract class CreateUser<T extends User, P extends CreateParams<T>>
  implements Service<P>
{
  public constructor(
    protected studentRepository: IStudentRepository,
    protected teacherRepository: ITeacherRepository,
  ) {}

  /**
   * @description Abstract method to create a user.
   * @param {T} user - The user to be created.
   * @returns {Promise<string>} The id of the created user.
   */
  abstract createUser(user: T): Promise<string>;

  /**
   * @description Executes the use case to create a user.
   * @param {P} input - The input parameters to create a user.
   * @returns {Promise<object>} An object containing the ID of the created user.
   */
  async execute(input: P): Promise<object> {
    const user: T = await input.fromObject(
      this.studentRepository,
      this.teacherRepository,
    );
    const id: string = await this.createUser(user);
    return { id: id };
  }
}