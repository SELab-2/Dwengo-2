import {
  DeleteJoinRequest,
  DeleteJoinRequestParams,
} from '../../../../src/core/services/join_request/deleteJoinRequest';
import { IJoinRequestRepository } from '../../../../src/core/repositories/joinRequestRepositoryInterface';
import { EntityNotFoundError } from '../../../../src/config/error';

describe('DeleteJoinRequest Service', () => {
  let deleteJoinRequestService: DeleteJoinRequest;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let params: DeleteJoinRequestParams;

  beforeEach(() => {
    mockJoinRequestRepository = {
      deleteJoinRequestById: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    deleteJoinRequestService = new DeleteJoinRequest(mockJoinRequestRepository);

    params = new DeleteJoinRequestParams('1');
  });

  test('Should throw error if join request not found in database', async () => {
    mockJoinRequestRepository.deleteJoinRequestById.mockRejectedValue(
      new EntityNotFoundError('Join request not found'),
    );

    await expect(deleteJoinRequestService.execute(params)).rejects.toThrow(
      'Join request not found',
    );
  });

  test('Should return empty object if join request is deleted', async () => {
    mockJoinRequestRepository.deleteJoinRequestById.mockResolvedValue(
      undefined,
    );

    await expect(deleteJoinRequestService.execute(params)).resolves.toEqual({});
    expect(
      mockJoinRequestRepository.deleteJoinRequestById,
    ).toHaveBeenCalledWith(params.id);
  });
});
