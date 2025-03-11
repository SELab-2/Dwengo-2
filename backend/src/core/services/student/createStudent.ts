import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../repositories/teacherRepositoryInterface";
import { CreateParams, CreateUser } from "../user";

/**
 * @extends {CreateParams<Student>}
 * @description Class representing the parameters required to create a student.
 */
export class CreateStudentParams extends CreateParams<Student> {
  createUser(): Student {
    return new Student(
      this.email,
      this.firstName,
      this.familyName,
      this.passwordHash,
      this.schoolName,
    );
  }
}

/**
 * @extends {CreateUser<Student, CreateStudentParams>}
 * @description Class representing the use case for creating a student.
 * @param {StudentRepositoryInterface} studentRepository - The student repository.
 * @param {ITeacherRepository} teacherRepository - The teacher repository.
 */
export class CreateStudent extends CreateUser<Student, CreateStudentParams> {
    public constructor(
        studentRepository: IStudentRepository,
        teacherRepository: ITeacherRepository,
    ) {
        super(studentRepository, teacherRepository)
    }

    /**
     * @description Creates a student.
     * @param {Student} user - The student to be created.
     * @returns {Promise<string>} The id of the created student.
     */
    public async createUser(user: Student): Promise<string> {
        const result = await this.studentRepository.createStudent(user)
        return result.id!;

    }
}