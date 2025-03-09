import { UseCase } from "../../../config/useCase";
import { Student } from "../../entities/student";
import { IStudentRepository } from "../../repositories/studentRepositoryInterface";

export class GetSudent implements UseCase<string, Student | null> {
  constructor(private studentRepository: IStudentRepository) {}

  /**
   * Gets a student from the DB.
   * @param id ID of the student to get from the DB.
   * @returns the student with the given id.
   * @throws Error if the student could not be found.
   */
  async execute(id: string): Promise<Student> {
    const student = await this.studentRepository.getStudent(id);
    return student;
  }
}