import {
  AcceptJoinRequest,
  AcceptJoinRequestInput,
} from '../../../../src/core/services/joinRequest/acceptJoinRequest';
import { IJoinRequestRepository } from '../../../../src/core/repositories/joinRequestRepositoryInterface';
import { IClassRepository } from '../../../../src/core/repositories/classRepositoryInterface';
import {
  JoinRequest,
  JoinRequestType,
} from '../../../../src/core/entities/joinRequest';
import { EntityNotFoundError } from '../../../../src/config/error';

describe('AcceptJoinRequest Service', () => {
  let acceptJoinRequestService: AcceptJoinRequest;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let mockClassRepository: jest.Mocked<IClassRepository>;
  let params: AcceptJoinRequestInput;

  beforeEach(() => {
    mockJoinRequestRepository = {
      getById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    mockClassRepository = {
      addUserToClass: jest.fn(),
    } as unknown as jest.Mocked<IClassRepository>;

    acceptJoinRequestService = new AcceptJoinRequest(
      mockJoinRequestRepository,
      mockClassRepository,
    );

    params = {
      id: '1'
    };
  });

  test('Should throw error if join request not found', async () => {
    mockJoinRequestRepository.getById.mockRejectedValue(
      new EntityNotFoundError('Join request not found'),
    );

    await expect(acceptJoinRequestService.execute(params)).rejects.toThrow(
      'Join request not found',
    );
  });

  test('Should add user to class and delete join request', async () => {
    const joinRequest: JoinRequest = new JoinRequest(
      'user1',
      'class1',
      JoinRequestType.STUDENT,
      '1',
    );

    mockJoinRequestRepository.getById.mockResolvedValue(joinRequest);
    mockClassRepository.addUserToClass.mockResolvedValue(undefined);
    mockJoinRequestRepository.delete.mockResolvedValue(
      undefined,
    );

    await expect(acceptJoinRequestService.execute(params)).resolves.toEqual({});
    expect(mockJoinRequestRepository.getById).toHaveBeenCalledWith(
      params.id,
    );
    expect(mockClassRepository.addUserToClass).toHaveBeenCalledWith(
      joinRequest.classId,
      joinRequest.requester,
      joinRequest.type,
    );
    expect(
      mockJoinRequestRepository.delete,
    ).toHaveBeenCalledWith(params.id);
  });
});
