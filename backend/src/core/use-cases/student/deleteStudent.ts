import { UseCase } from '../../../config/useCase';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';

/**
 * Delete a student from the DB.
 */

export class DeleteStudentParams{
  constructor(id: string) {
    this.id = id;
  }

  private id: string;

  getId(): string {
    return this.id;
  }
}

export class DeleteStudent implements UseCase<DeleteStudentParams, void> {
  constructor(private studentRepository: IStudentRepository) {}
  /**
   * Delete a student from the DB.
   * @param params Parameters containing the ID of the student to delete.
   * @returns void
   * @throws Error if the student that will be deleted does not exist.
   */
  async execute(params: DeleteStudentParams): Promise<void> {
    const student = await this.studentRepository.getStudent(params.getId());

    await this.studentRepository.deleteStudent(params.getId());
  }
}