import { GetClassGroups, GetClassGroupsParams } from '../../../../src/core/services/group/getClassGroups';
import { Group } from '../../../../src/core/entities/group';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockGroupRepository = {
    getByClassId: jest.fn(),
};

describe('GetClassGroups', () => {
    let getClassGroups: GetClassGroups;

    beforeEach(() => {
        getClassGroups = new GetClassGroups(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve all groups for a given class successfully', async () => {
        const inputParams = new GetClassGroupsParams("class-123");
        const groups = [
            new Group(["user-1", "user-2"], "class-123", "group-1"),
            new Group(["user-3", "user-4"], "class-123", "group-2")
        ];

        mockGroupRepository.getByClassId.mockResolvedValue(groups);

        const result = await getClassGroups.execute(inputParams);

        expect(result).toEqual({ groups: groups.map(group => group.toObject()) });
        expect(mockGroupRepository.getByClassId).toHaveBeenCalledWith("class-123");
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const inputParams = new GetClassGroupsParams("class-123");
        mockGroupRepository.getByClassId.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getClassGroups.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getByClassId).toHaveBeenCalledWith("class-123");
    });
});