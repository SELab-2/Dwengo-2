import { Service, ServiceParams } from '../../../config/service';
import { Student } from '../../entities/student';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ApiError, ErrorCode } from '../../../application/types';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';

/**
 * Class to be used by execute method to update a student's info in the DB.
 * If a field is not to be updated, it should be undefined in the constructor.
 */
export class UpdateStudentParams implements ServiceParams{
  private email?: string;
  private firstName?: string;
  private familyName?: string;
  private passwordHash?: string;
  private schoolName?: string;
  private id: string;

  constructor(
    id: string,
    email?: string,
    firstName?: string,
    familyName?: string,
    passwordHash?: string,
    schoolName?: string,
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.familyName = familyName;
    this.passwordHash = passwordHash;
    this.schoolName = schoolName;
  }

  /**
   * Creates an object with updated fields of a student.
   *
   * @param studentRepository repository to get student info from DB.
   * @returns a student object with the updated info.
   */
  async fromObject(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ): Promise<Student> {
    // Checks
    const student: Student = await studentRepository.getStudentById(this.id);

    // Check if email is not same when being updated
    if (this.email && student.email === this.email) {
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
    if (this.passwordHash && student.passwordHash === this.passwordHash) {
      throw {
        code: ErrorCode.BAD_REQUEST,
        message: 'Password cannot be the same as old one.',
      } as ApiError;
    }

    // Update student with new info
    const updatedStudent = new Student(
      this.email ?? student.email,
      this.firstName ?? student.firstName,
      this.familyName ?? student.familyName,
      this.passwordHash ?? student.passwordHash,
      this.schoolName ?? student.schoolName,
      this.id,
    );
    return updatedStudent;
  }

  toObject(): object {
    return {};
  }
}

export class UpdateStudent implements Service<UpdateStudentParams> {
  constructor(
    private studentRepository: IStudentRepository,
    private teacherRepository: ITeacherRepository,
  ) {}

  /**
   * Updates a student's info in the DB.
   *
   * @param input Object with new data of student to update in the DB.
   * @returns empty object, no additional info needed.
   */
  async execute(input: UpdateStudentParams): Promise<object> {
    const student: Student = await input.fromObject(
      this.studentRepository,
      this.teacherRepository,
    );
    await this.studentRepository.updateStudent(student);
    return input.toObject();
  }
}