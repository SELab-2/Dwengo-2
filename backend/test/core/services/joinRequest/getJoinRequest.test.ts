import { GetJoinRequests, GetJoinRequest, GetJoinRequestsParams, GetJoinRequestParams } from '../../../../src/core/services/join_request/getJoinRequest';
import { IJoinRequestRepository } from '../../../../src/core/repositories/joinRequestRepositoryInterface';
import { JoinRequest, JoinRequestType } from '../../../../src/core/entities/joinRequest';
import { ApiError, ErrorCode } from '../../../../src/application/types';

describe('GetJoinRequests Service', () => {
  let getJoinRequestsService: GetJoinRequests;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let params: GetJoinRequestsParams;

  beforeEach(() => {
    mockJoinRequestRepository = {
      getJoinRequestByRequesterId: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    getJoinRequestsService = new GetJoinRequests(mockJoinRequestRepository);

    params = new GetJoinRequestsParams('user1');
  });

  test('Should return all join requests for a user', async () => {
    const joinRequests: JoinRequest[] = [
      new JoinRequest('user1', 'class1', JoinRequestType.STUDENT, "1"),
      new JoinRequest('user1', 'class2', JoinRequestType.TEACHER, "2"),
    ];

    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue(joinRequests);

    await expect(getJoinRequestsService.execute(params)).resolves.toEqual({
      requests: joinRequests.map(request => request.toObject()),
    });
    expect(mockJoinRequestRepository.getJoinRequestByRequesterId).toHaveBeenCalledWith(params.userId);
  });
});

describe('GetJoinRequest Service', () => {
  let getJoinRequestService: GetJoinRequest;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let params: GetJoinRequestParams;

  beforeEach(() => {
    mockJoinRequestRepository = {
      getJoinRequestByRequesterId: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    getJoinRequestService = new GetJoinRequest(mockJoinRequestRepository);

    params = new GetJoinRequestParams('user1', '1');
  });

  test('Should return a single join request for a user', async () => {
    const joinRequests: JoinRequest[] = [
      new JoinRequest('user1', 'class1', JoinRequestType.TEACHER, "1"),
      new JoinRequest('user1', 'class2', JoinRequestType.STUDENT, "2"),
    ];

    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue(joinRequests);

    await expect(getJoinRequestService.execute(params)).resolves.toEqual({
      request: joinRequests[0].toObject(),
    });
    expect(mockJoinRequestRepository.getJoinRequestByRequesterId).toHaveBeenCalledWith(params.userId);
  });

  test('Should throw error if join request not found', async () => {
    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue([]);

    await expect(getJoinRequestService.execute(params)).rejects.toEqual({
      code: ErrorCode.NOT_FOUND,
      message: 'joinRequest not found.',
    } as ApiError);
  });
});