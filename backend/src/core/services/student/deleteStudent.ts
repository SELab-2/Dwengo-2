import { Service, ServiceParams } from '../../../config/service';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';

/**
 * Delete a student from the DB.
 */

export class DeleteStudentParams implements ServiceParams {
  constructor(id: string) {
    this.id = id;
  }

  private id: string;

  getId(): string {
    return this.id;
  }
}

export class DeleteStudent implements Service<DeleteStudentParams, object> {
  constructor(private studentRepository: IStudentRepository) {}
  /**
   * Delete a student from the DB.
   * @param params Parameters containing the ID of the student to delete.
   * @returns void
   * @throws Error if the student that will be deleted does not exist.
   */
  async execute(input: DeleteStudentParams): Promise<object> {
    const student = await this.studentRepository.getStudent(input.getId());

    await this.studentRepository.deleteStudent(input.getId());
    return {};
  }
}