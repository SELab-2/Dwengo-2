import { GetUserJoinRequests, GetJoinRequest, GetUserJoinRequestsInput, GetJoinRequestInput } from '../../../../src/core/services/joinRequest/getJoinRequest';
import { IJoinRequestRepository } from '../../../../src/core/repositories/joinRequestRepositoryInterface';
import { JoinRequest, JoinRequestType } from '../../../../src/core/entities/joinRequest';
import { ApiError, ErrorCode } from '../../../../src/application/types';

describe('GetUserJoinRequests Service', () => {
  let getJoinRequestsService: GetUserJoinRequests;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let input: GetUserJoinRequestsInput;

  beforeEach(() => {
    mockJoinRequestRepository = {
      getJoinRequestByRequesterId: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    getJoinRequestsService = new GetUserJoinRequests(mockJoinRequestRepository);

    input = {
      userId: 'user1'
    };
  });

  test('Should return all join requests for a user', async () => {
    const joinRequests: JoinRequest[] = [
      new JoinRequest('user1', 'class1', JoinRequestType.STUDENT, "1"),
      new JoinRequest('user1', 'class2', JoinRequestType.TEACHER, "2"),
    ];

    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue(joinRequests);

    await expect(getJoinRequestsService.execute(input)).resolves.toEqual({
      requests: joinRequests.map(request => request.toObject()),
    });
    expect(mockJoinRequestRepository.getJoinRequestByRequesterId).toHaveBeenCalledWith(input.userId);
  });
});

describe('GetJoinRequest Service', () => {
  let getJoinRequestService: GetJoinRequest;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let input: GetJoinRequestInput;

  beforeEach(() => {
    mockJoinRequestRepository = {
      getJoinRequestByRequesterId: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    getJoinRequestService = new GetJoinRequest(mockJoinRequestRepository);

    input = {
      userId: "user1",
      requestId: "1"
    };
  });

  test('Should return a single join request for a user', async () => {
    const joinRequests: JoinRequest[] = [
      new JoinRequest('user1', 'class1', JoinRequestType.TEACHER, "1"),
      new JoinRequest('user1', 'class2', JoinRequestType.STUDENT, "2"),
    ];

    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue(joinRequests);

    await expect(getJoinRequestService.execute(input)).resolves.toEqual({
      request: joinRequests[0].toObject(),
    });
    expect(mockJoinRequestRepository.getJoinRequestByRequesterId).toHaveBeenCalledWith(input.userId);
  });

  test('Should throw error if join request not found', async () => {
    mockJoinRequestRepository.getJoinRequestByRequesterId.mockResolvedValue([]);

    await expect(getJoinRequestService.execute(input)).rejects.toEqual({
      code: ErrorCode.NOT_FOUND,
      message: 'joinRequest not found.',
    } as ApiError);
  });
});