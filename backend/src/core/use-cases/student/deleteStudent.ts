import { StudentRepositoryInterface } from '../../repositories/studentRepositoryInterface';
import { UseCase } from '../../../config/useCase';

export class DeleteStudent implements UseCase<string, void> {
  constructor(private studentRepository: StudentRepositoryInterface) {}

  async execute(id: string): Promise<void> {
    const student = await this.studentRepository.getStudent(id);

    if (!student) {
      throw new Error('Student not found');
    }
  }
}