import { DatabaseError } from "../../../../../src/config/error";
import { Group } from "../../../../../src/core/entities/group";
import { GetGroup } from "../../../../../src/core/services/group/getGroup";

// Mock repository
const mockGroupRepository = {
    getById: jest.fn(),
};

describe("GetGroup", () => {
    let getGroup: GetGroup;

    beforeEach(() => {
        getGroup = new GetGroup(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test("Should retrieve a group successfully", async () => {
        const id = "group-123";
        const group = new Group(["user-1", "user-2"], "class-456", "group-123");

        mockGroupRepository.getById.mockResolvedValue(group);

        const result = await getGroup.execute({ id });

        expect(result).toEqual(group.toObject());
        expect(mockGroupRepository.getById).toHaveBeenCalledWith(id);
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        const id = "group-123";
        mockGroupRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getGroup.execute({ id })).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getById).toHaveBeenCalledWith(id);
    });
});
