import { Service, ServiceParams } from '../../../config/service';
import { Student } from '../../entities/student';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { User } from '../../entities/user';
import { Teacher } from '../../entities/teacher';

/**
 * Class to be used by execute method to update a student's info in the DB.
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
   * Creates an object with updated fields of a user.
   *
   * @param studentRepository repository to get student info from DB.
   * @param teacherRepository repository to get teacher info from DB.
   * @returns a student object with the updated info.
   */
  async fromObject(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ): Promise<T> {
    // Checks
    const user: T = await this.getOldUser();

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

    // Update student with new info
    const updatedUser = new Student(
      this.email ?? user.email,
      this.firstName ?? user.firstName,
      this.familyName ?? user.familyName,
      this.passwordHash ?? user.passwordHash,
      this.schoolName ?? user.schoolName,
      this.id,
    );
    return this.createNewUser(user);
  }

  /**
   * @description Abstract method to create a user object.
   * @returns {T} The created user.
   */
  abstract createNewUser(oldUser: T): T;

  /**
   * @description Abstract method to create a user object.
   * @returns {T} The created user.
   */
  abstract getOldUser(): Promise<T>;

  toObject(): object {
    return {};
  }
}

/**
 * @extends {UpdateParams<Teacher>}
 * @description Class representing the parameters required to update a teacher.
 */
export class UpdateTeacherParams extends UpdateParams<Teacher> {
  constructor(
    id: string,
    private repository: ITeacherRepository,
    email?: string,
    firstName?: string,
    familyName?: string,
    passwordHash?: string,
    schoolName?: string,
  ) {
    super(id, email, firstName, familyName, passwordHash, schoolName);
  }
  createNewUser(oldUser: Teacher): Teacher {
    return new Teacher(
      this.email ?? oldUser.email,
      this.firstName ?? oldUser.firstName,
      this.familyName ?? oldUser.familyName,
      this.passwordHash ?? oldUser.passwordHash,
      this.schoolName ?? oldUser.schoolName,
      this.id,
    );
  }

  async getOldUser(): Promise<Teacher> {
    return await this.repository.getTeacherById(this.id);
  }
}

/**
 * @extends {UpdateParams<Student>}
 * @description Class representing the parameters required to update a student.
 */
export class UpdateTeacherParams extends UpdateParams<Student> {
  createNewUser(oldUser: Student): Student {
    return new Student(
      this.email ?? oldUser.email,
      this.firstName ?? oldUser.firstName,
      this.familyName ?? oldUser.familyName,
      this.passwordHash ?? oldUser.passwordHash,
      this.schoolName ?? oldUser.schoolName,
      this.id,
    );
  }

  getOldUser(): Student {
    studentRepository.get;
  }
}

export abstract class UpdateStudent<T extends User, P extends UpdateParams<T>>
  implements Service<P>
{
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  /**
   * @description Abstract method to update a user.
   * @param {T} user - The user to be updated.
   * @returns {Promise<void>} The id of the updated user.
   */
  abstract updateUser(user: T): Promise<void>;

  /**
   * Updates a student's info in the DB.
   *
   * @param input Object with new data of student to update in the DB.
   * @returns empty object, no additional info needed.
   */
  async execute(input: P): Promise<object> {
    const user: T = await input.fromObject(
      this.studentRepository,
      this.teacherRepository,
    );
    await this.updateUser(user);
    return {};
  }
}
