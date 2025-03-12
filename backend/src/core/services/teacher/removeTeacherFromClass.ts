import { Service, ServiceParams } from '../../../config/service';
import { ITeacherRepository } from '../../repositories/teacherRepositoryInterface';

export class RemoveTeacherFromClassParams implements ServiceParams {
  constructor(private _teacherId: string, private _classId: string) {}
  get teacherId() {
    return this._teacherId;
  }

  get classId() {
    return this._classId;
  }
}

export class RemoveTeacherFromClass
  implements Service<RemoveTeacherFromClassParams>
{
  constructor(private teacherRepository: ITeacherRepository) {}

  async execute(input: RemoveTeacherFromClassParams): Promise<object> {
    await this.teacherRepository.deleteTeacherFromClass(
      input.teacherId,
      input.classId,
    );
    return {};
  }
}
