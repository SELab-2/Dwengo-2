import { UseCase } from "../../../config/usecase";
import { Student } from "../../entities/student";
import { StudentRepositoryInterface } from "../../repositories/studentRepositoryInterface";

export class GetSudent implements UseCase<string, Student | null> {
  constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Gets a student from the DB.
   * @param id ID of the student to get from the DB.
   * @returns the student with the given id.
   * @throws Error if the student could not be found.
   */
  async execute(id: string): Promise<Student> {
    try {
      const student = await this.studentRepository.getStudent(id);
      return student;
    } catch (error) {
      throw error;
    }
    
    
  }
}