import { DeleteGroup, DeleteGroupParams } from '../../../../src/core/services/group/deleteGroup';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockGroupRepository = {
    delete: jest.fn(),
};

describe('DeleteGroup', () => {
    let deleteGroup: DeleteGroup;

    beforeEach(() => {
        deleteGroup = new DeleteGroup(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test('Should delete a group successfully', async () => {
        const inputParams = new DeleteGroupParams("group-123");
        mockGroupRepository.delete.mockResolvedValue(undefined);

        const result = await deleteGroup.execute(inputParams);

        expect(result).toEqual({});
        expect(mockGroupRepository.delete).toHaveBeenCalledWith("group-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        const inputParams = new DeleteGroupParams("group-123");
        mockGroupRepository.delete.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteGroup.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.delete).toHaveBeenCalledWith("group-123");
    });
});