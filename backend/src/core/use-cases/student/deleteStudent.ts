import { UseCase } from '../../../config/useCase';
import { Student } from '../../entities/student';
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
   */
  async execute(params: DeleteStudentParams): Promise<void> {
    const student = await this.studentRepository.getStudent(params.getId());

    if (!student) {
      throw new Error('Student not found');
    }

    await this.studentRepository.deleteStudent(params.getId());
  }
}