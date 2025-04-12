import { DatabaseError } from "../../../../src/config/error";
import { DeleteGroup } from "../../../../src/core/services/group/deleteGroup";

// Mock repository
const mockGroupRepository = {
    delete: jest.fn(),
};

describe("DeleteGroup", () => {
    let deleteGroup: DeleteGroup;

    beforeEach(() => {
        deleteGroup = new DeleteGroup(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test("Should delete a group successfully", async () => {
        const id = "group-123";
        mockGroupRepository.delete.mockResolvedValue(undefined);

        const result = await deleteGroup.execute({ id });

        expect(result).toEqual({});
        expect(mockGroupRepository.delete).toHaveBeenCalledWith(id);
    });

    test("Should throw a DatabaseError if deletion fails", async () => {
        const id = "group-123";
        mockGroupRepository.delete.mockRejectedValue(new DatabaseError("Deletion failed"));

        await expect(deleteGroup.execute({ id })).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.delete).toHaveBeenCalledWith("group-123");
    });
});
