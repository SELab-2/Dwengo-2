import { IStudentRepository } from '../../../../src/core/repositories/studentRepositoryInterface';
import {
  RemoveUserFromGroup,
  RemoveUserFromParams,
} from '../../../../src/core/services/user';
import { UserType } from '../../../../src/core/entities/user';
import { ErrorCode } from '../../../../src/application/types';

describe('RemoveStudentFromGroup', () => {
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let removeStudentFromGroup: RemoveUserFromGroup;

  beforeEach(() => {
    mockStudentRepository = {
      removeFromGroup: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;
    removeStudentFromGroup = new RemoveUserFromGroup(mockStudentRepository);
  });

  it('should call removeStudentFromGroup on the repository with correct parameters', async () => {
    const params = new RemoveUserFromParams('123', '456', UserType.STUDENT);

    await removeStudentFromGroup.execute(params);

    expect(mockStudentRepository.removeFromGroup).toHaveBeenCalledWith(
      '123',
      '456',
    );
    expect(mockStudentRepository.removeFromGroup).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should throw error when trying to remove a teacher from a group', async () => {
    mockStudentRepository.removeFromGroup.mockRejectedValue(
      new Error('Student not found'),
    );
    const params = new RemoveUserFromParams('123', '456', UserType.TEACHER);

    await expect(removeStudentFromGroup.execute(params)).rejects.toEqual({
      code: ErrorCode.BAD_REQUEST,
      message: 'Only students can be part of a group.',
    });
  });

  it('should handle errors thrown by the repository', async () => {
    mockStudentRepository.removeFromGroup.mockRejectedValue(
      new Error('Student not found'),
    );
    const params = new RemoveUserFromParams('123', '456', UserType.STUDENT);

    await expect(removeStudentFromGroup.execute(params)).rejects.toThrow(
      'Student not found',
    );
  });
});
