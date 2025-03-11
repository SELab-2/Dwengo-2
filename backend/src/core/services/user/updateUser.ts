import { Service, ServiceParams } from '../../../config/service';
import { Student } from '../../entities/student';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { User } from '../../entities/user';
import { Teacher } from '../../entities/teacher';

/**
 * Class to be used by execute method to update a user's info in the DB.
 * If a field is not to be updated, it should be undefined in the constructor.
 */
export abstract class UpdateParams<T extends User> implements ServiceParams {
  constructor(
    protected id: string,
    protected email?: string,
    protected firstName?: string,
    protected familyName?: string,
    protected passwordHash?: string,
    protected schoolName?: string,
  ) {}

  /**
   * Updates an object with updated fields of a user.
   *
   * @param studentRepository repository to get student info from DB.
   * @param teacherRepository repository to get teacher info from DB.
   * @returns a student object with the updated info.
   */
  async fromObject(
    getOldUser: (id: string) => Promise<T>,
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ): Promise<T> {
    // Checks
    const user: T = await getOldUser(this.id);

    // Check if email is not same when being updated
    if (this.email && user.email === this.email) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Email cannot be the same as old one.',
      } as ApiError;
    }

    // Check if email is already in use
    if (this.email) {
      const studentPresent: boolean = await studentRepository.checkByEmail(
        this.email,
      );
      const teacherPresent: boolean =
        await teacherRepository.checkTeacherByEmail(this.email);
      if (studentPresent || teacherPresent) {
        throw {
          code: ErrorCode.BAD_REQUEST,
          message: 'Email already in use.',
        } as ApiError;
      }
    }

    // Check if password is not same when being updated
    if (this.passwordHash && user.passwordHash === this.passwordHash) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Password cannot be the same as old one.',
      } as ApiError;
    }

    return this.createNewUser(user);
  }

  /**
   * @description Abstract method to create a new user object.
   * @returns {T} The created user.
   */
  abstract createNewUser(oldUser: T): T;

  toObject(): object {
    return {};
  }
}

/**
 * @template T The type of user to be updated.
 * @template P The corresponding type of params to be used.
 * @implements {Service<P>}
 * @description Abstract class representing the service for updating a user.
 * @param {StudentRepositoryInterface} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export abstract class UpdateUser<T extends User, P extends UpdateParams<T>>
  implements Service<P>
{
  constructor(
    protected studentRepository: IStudentRepository,
    protected teacherRepository: ITeacherRepository,
  ) {}

  /**
   * @description Abstract method to update a user.
   * @param {T} user - The user to be updated.
   * @returns {Promise<void>} The id of the updated user.
   */
  abstract updateUser(user: T): Promise<void>;

  /**
   * @description Abstract method to get old user.
   * @param {T} user - The id of user to get.
   * @returns {Promise<void>} The id of the updated user.
   */
  abstract getOldUser(id: string): Promise<T>;

  /**
   * Updates a student's info in the DB.
   *
   * @param input Object with new data of student to update in the DB.
   * @returns empty object, no additional info needed.
   */
  async execute(input: P): Promise<object> {
    const user: T = await input.fromObject(
      this.getOldUser.bind(this),
      this.studentRepository,
      this.teacherRepository,
    );
    await this.updateUser(user);
    return {};
  }
}
