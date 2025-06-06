import { DatabaseError } from "../../../../../src/config/error";
import { Group } from "../../../../../src/core/entities/group";
import { GetUserGroups } from "../../../../../src/core/services/group/getUserGroups";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockGroupRepository = {
    getByUserId: jest.fn(),
};

const mockUserRepository = {
    getById: jest.fn(),
} as unknown as jest.Mocked<IUserRepository>;

describe("GetUserGroups", () => {
    let getUserGroups: GetUserGroups;

    beforeEach(() => {
        getUserGroups = new GetUserGroups(mockGroupRepository as any, mockUserRepository);
        jest.clearAllMocks();
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should retrieve all groups for a given user successfully", async () => {
        const idParent = "user-123";
        const groups = [
            new Group(["user-123", "user-2"], "class-456", "group-1"),
            new Group(["user-123", "user-3"], "class-789", "group-2"),
        ];

        mockGroupRepository.getByUserId.mockResolvedValue(groups);

        const result = await getUserGroups.execute("", { idParent });

        expect(result).toEqual({ groups: groups.map(group => group.id) });
        expect(mockGroupRepository.getByUserId).toHaveBeenCalledWith(idParent);
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        const idParent = "user-123";
        mockGroupRepository.getByUserId.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getUserGroups.execute("", { idParent })).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.getByUserId).toHaveBeenCalledWith("user-123");
    });
});
