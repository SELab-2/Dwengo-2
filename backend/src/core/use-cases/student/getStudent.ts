import { UseCase } from "../../../config/usecase";
import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export class GetSudent implements UseCase<string, Student | null> {
  constructor(private studentRepository: IStudentRepository) {}

  /**
   * Gets a student from the DB.
   * @param id ID of the student to get from the DB.
   * @returns the student with the given id or null if student is not present in DB.
   */
  async execute(id: string): Promise<Student | null> {
    const student = await this.studentRepository.getStudent(id);
    return student;
  }
}