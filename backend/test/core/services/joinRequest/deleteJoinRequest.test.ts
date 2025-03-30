import {
  DeleteJoinRequest,
  DeleteJoinRequestInput,
} from '../../../../src/core/services/joinRequest/deleteJoinRequest';
import { IJoinRequestRepository } from '../../../../src/core/repositories/joinRequestRepositoryInterface';
import { EntityNotFoundError } from '../../../../src/config/error';

describe('DeleteJoinRequest Service', () => {
  let deleteJoinRequestService: DeleteJoinRequest;
  let mockJoinRequestRepository: jest.Mocked<IJoinRequestRepository>;
  let input: DeleteJoinRequestInput;

  beforeEach(() => {
    mockJoinRequestRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IJoinRequestRepository>;

    deleteJoinRequestService = new DeleteJoinRequest(mockJoinRequestRepository);

    input = {
      id: "1"
    };
  });

  test('Should throw error if join request not found in database', async () => {
    mockJoinRequestRepository.delete.mockRejectedValue(
      new EntityNotFoundError('Join request not found'),
    );

    await expect(deleteJoinRequestService.execute(input)).rejects.toThrow(
      'Join request not found',
    );
  });

  test('Should return empty object if join request is deleted', async () => {
    mockJoinRequestRepository.delete.mockResolvedValue(
      undefined,
    );

    await expect(deleteJoinRequestService.execute(input)).resolves.toEqual({});
    expect(
      mockJoinRequestRepository.delete,
    ).toHaveBeenCalledWith(input.id);
  });
});
