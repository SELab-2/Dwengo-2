import { Teacher } from '../../entities/teacher';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';
import { GetUser } from '../user';

// Class to get a student from the DB
export class GetTeacher extends GetUser {
  constructor(private teacherRepository: ITeacherRepository) {
    super();
  }

  /**
   * Function that retrieves a teacher with a given id from the DB.
   * 
   * @param id of the student to get from the DB.
   * @returns object with the info of the student.
   */
  public async getUser(id: string): Promise<object> {
    const teacher: Teacher = await this.teacherRepository.getTeacherById(id);
    return {
      id: teacher.id,
      email: teacher.email,
      firstName: teacher.firstName,
      familyName: teacher.familyName,
      schoolName: teacher.schoolName
    };
  }
}