import { GetGroup, GetGroupParams } from '../../../../src/core/services/group/getGroup';
import { Group } from '../../../../src/core/entities/group';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockGroupRepository = {
    getById: jest.fn(),
};

describe('GetGroup', () => {
    let getGroup: GetGroup;

    beforeEach(() => {
        getGroup = new GetGroup(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve a group successfully', async () => {
        const inputParams = new GetGroupParams("group-123");
        const group = new Group(["user-1", "user-2"], "class-456", "group-123");

        mockGroupRepository.getById.mockResolvedValue(group);

        const result = await getGroup.execute(inputParams);

        expect(result).toEqual(group.toObject());
        expect(mockGroupRepository.getById).toHaveBeenCalledWith("group-123");
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const inputParams = new GetGroupParams("group-123");
        mockGroupRepository.getById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getGroup.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getById).toHaveBeenCalledWith("group-123");
    });
});
