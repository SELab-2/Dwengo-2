import { UseCase } from "../../../config/usecase";
import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export class DeleteStudent implements UseCase<Student, void> {

  constructor(private studentRepository: IStudentRepository) {}

  /**
   * UseCase to delete a student from the DB.
   * 
   * @param student the student to delete.
   * @returns void
   */
  public async execute(student: Student): Promise<void> {
    return await this.studentRepository.deleteStudent(student);
  }
}