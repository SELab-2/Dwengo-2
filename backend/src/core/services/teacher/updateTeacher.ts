import { Student } from '../../entities/student';
import { Teacher } from '../../entities/teacher';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { UpdateUser, UpdateParams } from '../user/updateUser';

/**
 * @extends {UpdateParams<Teacher>}
 * @description Class representing the parameters required to update a teacher.
 */
export class UpdateTeacherParams extends UpdateParams<Teacher> {
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
}

export class UpdateTeacher extends UpdateUser<Teacher, UpdateTeacherParams> {
  constructor(
    studentRepository: IStudentRepository,
    teacherRepository: ITeacherRepository,
  ) {
    super(studentRepository, teacherRepository)
  }
  async updateUser(user: Student): Promise<void> {
    await this.teacherRepository.updateTeacher(user);
  }
  async getOldUser(id: string): Promise<Student> {
    return await this.teacherRepository.getTeacherById(id);
  }
}