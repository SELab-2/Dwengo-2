import { UseCase } from '../../../config/usecase';
import { Student } from '../../entities/student';
import { StudentRepositoryInterface } from '../../repositories/studentRepositoryInterface';
import { AppError } from '../../../config/error';
import { ApiError, ErrorCode } from '../../../application/types';
import { User } from '../../entities/user';

export class CreateParams {
  private email: string;
  private firstName: string;
  private familyName: string;
  private passwordHash: string;
  private schoolName: string;
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
}

export class CreateUser implements UseCase<User, string> {
  public constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Validates user input.
   *
   * @param input user object to be validated.
   * @returns void
   *
   * @throws ApiError if input is invalid.
   */
  private async validateInput(input: Student): Promise<void> {
    // Check email
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw {
        code: ErrorCode.CONFLICT,
        message: 'Email already in use.',
      } as ApiError;
    }

    // Check if email not already in use
    const present: boolean = await this.studentRepository.findByEmail(
      input.email,
    );
    if (present) {
      throw {
        code: ErrorCode.CONFLICT,
        message: 'Email already in use.',
      } as ApiError;
    }
  }

  /**
   * Creates a new user.
   *
   * @param input user to be created.
   * @returns object with created user.
   *
   * @throws ApiError if input is invalid.
   */
  async execute(input: Student): Promise<string> {
    // Check if input is valid
    await this.validateInput(input);

    // Save the student to the database
    const id: string = await this.studentRepository.createStudent(input);
    return id;
  }
}
