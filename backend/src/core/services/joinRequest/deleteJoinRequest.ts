import { Service, ServiceParams } from '../../../config/service';
import { IJoinRequestRepository } from '../../repositories/joinRequestRepositoryInterface';

export class DeleteJoinRequestParams implements ServiceParams {
  constructor(private _id: string) {}

  get id(): string {
    return this._id;
  }
}

export class DeleteJoinRequest implements Service<DeleteJoinRequestParams> {
  constructor(private joinRequestRepository: IJoinRequestRepository) {}

  async execute(input: DeleteJoinRequestParams): Promise<object> {
    await this.joinRequestRepository.deleteJoinRequestById(input.id);
    return {};
  }
}
