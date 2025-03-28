import { GetAssignmentGroups } from '../../../../src/core/services/group/getAssignmentGroups';
import { Group } from '../../../../src/core/entities/group';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockGroupRepository = {
    getByAssignmentId: jest.fn(),
};

describe('GetAssignmentGroups', () => {
    let getAssignmentGroups: GetAssignmentGroups;

    beforeEach(() => {
        getAssignmentGroups = new GetAssignmentGroups(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve all groups for a given assignment successfully', async () => {
        const id = "assignment-123";
        const groups = [
            new Group(["user-1", "user-2"], "class-123", "group-1"),
            new Group(["user-3", "user-4"], "class-123", "group-2")
        ];

        mockGroupRepository.getByAssignmentId.mockResolvedValue(groups);

        const result = await getAssignmentGroups.execute({id});

        expect(result).toEqual({ groups: groups.map(group => group.toObject()) });
        expect(mockGroupRepository.getByAssignmentId).toHaveBeenCalledWith(id);
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const id = "assignment-123";
        mockGroupRepository.getByAssignmentId.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getAssignmentGroups.execute({id})).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getByAssignmentId).toHaveBeenCalledWith(id);
    });
});