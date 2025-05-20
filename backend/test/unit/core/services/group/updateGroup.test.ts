import { DatabaseError } from "../../../../../src/config/error";
import { Group } from "../../../../../src/core/entities/group";
import { UpdateGroup } from "../../../../../src/core/services/group/updateGroup";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockGroupRepository = {
    getById: jest.fn(),
    update: jest.fn(),
};

const mockUserRepository = {
    getById: jest.fn(),
} as unknown as jest.Mocked<IUserRepository>;

describe("UpdateGroup", () => {
    let updateGroup: UpdateGroup;

    beforeEach(() => {
        updateGroup = new UpdateGroup(mockGroupRepository as any, mockUserRepository);
        jest.clearAllMocks();
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should update group members successfully", async () => {
        const inputParams = {
            id: "group-123",
            members: ["user-1", "user-2", "user-3"],
        };
        const existingGroup = new Group(["user-1", "user-2"], "class-456", "group-123");

        mockGroupRepository.getById.mockResolvedValue(existingGroup);
        mockGroupRepository.update.mockResolvedValue(existingGroup);

        const result = await updateGroup.execute("", inputParams);

        expect(result).toEqual({});
        expect(mockGroupRepository.getById).toHaveBeenCalledWith("group-123");
        expect(mockGroupRepository.update).toHaveBeenCalledWith(expect.any(Group));
    });

    test("Should throw a DatabaseError if update fails", async () => {
        const inputParams = {
            id: "group-123",
            members: ["user-1", "user-2", "user-3"],
        };
        mockGroupRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(updateGroup.execute("", inputParams)).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getById).toHaveBeenCalledWith("group-123");
    });
});
