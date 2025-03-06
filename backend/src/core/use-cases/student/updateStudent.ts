import { UseCase } from "../../../config/usecase";
import { Student } from "../../entities/student";
import { StudentRepositoryInterface } from "../../repositories/studentRepositoryInterface";

export class UpdateStudent implements UseCase<Student, void> {
  constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Updates a student's info in the DB.
   * 
   * @param input Student object with new data of student to update in the DB.
   * @returns void
   * @throws Error if the student is not present in the DB.
   */
  async execute(input: Student): Promise<void> {
    await this.studentRepository.updateStudent(input);
  }
}