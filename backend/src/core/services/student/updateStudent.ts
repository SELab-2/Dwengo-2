import { Student } from '../../entities/student';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { UpdateParams, UpdateUser } from '../user/updateUser';

/**
 * @extends {UpdateParams<Student>}
 * @description Class representing the parameters required to update a student.
 */
export class UpdateStudentParams extends UpdateParams<Student> {
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
}

export class UpdateStudent extends UpdateUser<Student, UpdateStudentParams> {
  constructor(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ) {
    super(studentRepository, teacherRepository)
  }
  async updateUser(user: Student): Promise<void> {
    await this.studentRepository.updateStudent(user);
  }
  async getOldUser(id: string): Promise<Student> {
    return await this.studentRepository.getStudentById(id);
  }
}