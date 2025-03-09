import { UseCase } from "../../../config/useCase";
import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export class GetSudent implements UseCase<string, Student | null> {
  constructor(private studentRepository: IStudentRepository) {}

  /**
   * Function that retrieves a student with a given id from the DB.
   * 
   * @param id of the student to get from the DB.
   * @returns object with the info of the student.
   */
  public async getUser(id: string): Promise<object> {
    const student: Student = await this.studentRepository.getStudent(id);
    return {
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      familyName: student.familyName,
      schoolName: student.schoolName
    };
  }
}
