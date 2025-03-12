import { ApiError, ErrorCode } from '../../../application/types';
import { Service, ServiceParams } from '../../../config/service';
import { JoinRequest } from '../../entities/joinRequest';
import { IJoinRequestRepository } from '../../repositories/joinRequestRepositoryInterface';

/**
 * @description paramaters to get all joinRequests of a user
 *
 * @param _userId The id of the user.
 */
export class GetJoinRequestsParams implements ServiceParams {
  constructor(protected _userId: string) {}

  get userId() {
    return this._userId;
  }
}

/**
 * @description paramaters to get a single joinRequest of a user
 * @param _userId The id of the user.
 * @param _requestId The id of the joinRequest.
 */
export class GetJoinRequestParams extends GetJoinRequestsParams {
  constructor(userId: string, private _requestId: string) {
    super(userId);
  }

  get requestId(): string {
    return this._requestId;
  }
}

/**
 * @description class representing service to get all joinRequests of a user
 *
 */
export class GetJoinRequests implements Service<GetJoinRequestsParams> {
  constructor(private joinRequestRepository: IJoinRequestRepository) {}

  async execute(input: GetJoinRequestsParams): Promise<object> {
    // Get all requests for user
    const requests: JoinRequest[] =
      await this.joinRequestRepository.getJoinRequestByRequesterId(
        input.userId,
      );
    return {
      requests: requests.map(request => request.toObject()),
    };
  }
}

/**
 * @description class representing service to get a single joinRequest of a user
 */
export class GetJoinRequest implements Service<GetJoinRequestParams> {
  constructor(private joinRequestRepository: IJoinRequestRepository) {}

  async execute(input: GetJoinRequestParams): Promise<object> {
    // Get all requests
    const requests: JoinRequest[] =
      await this.joinRequestRepository.getJoinRequestByRequesterId(
        input.userId,
      );

    // Search for request with id
    const joinRequest: JoinRequest[] = requests.filter(
      request => request.id === input.requestId,
    );

    // No request found for this user with the given id.
    if (joinRequest.length === 0) {
      throw {
        code: ErrorCode.NOT_FOUND,
        message: 'joinRequest not found.',
      } as ApiError;
    }
    return { request: joinRequest[0].toObject() };
  }
}
