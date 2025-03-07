import { UseCase } from '../../../config/useCase';
import { IStudentRepository } from '../../repositories/studentRepositoryInterface';

export class DeleteStudent implements UseCase<string, void> {
  constructor(private studentRepository: IStudentRepository) {}
  /**
   * Delete a student from the DB.
   * @param id ID of the student to get from the DB and check if it exists. Then delete it.
   * @returns void
   */
  async execute(id: string): Promise<void> {
    const student = await this.studentRepository.getStudent(id);

    if (!student) {
      throw new Error('Student not found');
    }

    await this.studentRepository.deleteStudent(student);
  }
}