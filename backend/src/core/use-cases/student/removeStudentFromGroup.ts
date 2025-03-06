import { UseCase } from "../../../config/usecase";
import { StudentRepositoryInterface } from "../../repositories/studentRepositoryInterface";

interface RemoveStudentFromGroupInput {
    studentId: string;
    groupId: string;
}

export class RemoveStudentFromGroup implements UseCase<RemoveStudentFromGroupInput, void> {

  public constructor(private studentRepository: StudentRepositoryInterface) {}

  /**
   * Removes a student from a group.
   * 
   * @param input object containing studentId and groupId
   * @returns void
   * 
   * @throws Error if student is not found
   * @throws Error if group is not found
   */
  async execute(input: RemoveStudentFromGroupInput): Promise<void> {
    await this.studentRepository.removeStudentFromGroup(input.studentId, input.groupId);
  }
}