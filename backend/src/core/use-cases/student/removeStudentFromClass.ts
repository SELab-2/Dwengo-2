import { UseCase } from "../../../config/usecase";
import { StudentRepositoryInterface } from "../../repositories/studentRepositoryInterface";

interface RemoveStudentFromClassInput {
    studentId: string;
    classId: string;
  }

export class RemoveStudentFromClass implements UseCase<RemoveStudentFromClassInput, void> {

  public constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Removes a student from a class.
   * 
   * @param input object containing studentId and classId
   * @returns void
   * 
   * @throws Error if student is not found
   * @throws Error if class is not found
   */
  async execute(input: RemoveStudentFromClassInput): Promise<void> {
    await this.studentRepository.removeStudentFromClass(input.studentId,input.classId);
  }
}