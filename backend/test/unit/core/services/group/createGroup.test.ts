import { DatabaseError } from "../../../../../src/config/error";
import { Group } from "../../../../../src/core/entities/group";
import { CreateGroup } from "../../../../../src/core/services/group/createGroup";

// Mock repository
const mockGroupRepository = {
    create: jest.fn(),
};

describe("CreateGroup", () => {
    let createGroup: CreateGroup;

    beforeEach(() => {
        createGroup = new CreateGroup(mockGroupRepository as any);
        jest.clearAllMocks();
    });

    test("Should create a group successfully", async () => {
        const inputParams = {
            members: ["user-123", "user-456"],
            assignment: "assigment-789",
        };
        const createdGroup = new Group(["user-123", "user-456"], "assigment-789", "group-999");

        mockGroupRepository.create.mockResolvedValue(createdGroup);

        const result = await createGroup.execute(inputParams);

        expect(result).toEqual({ id: "group-999" });
        expect(mockGroupRepository.create).toHaveBeenCalledWith(expect.any(Group));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        const inputParams = {
            members: ["user-123", "user-456"],
            assignment: "assigment-789",
        };
        mockGroupRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createGroup.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockGroupRepository.create).toHaveBeenCalledWith(expect.any(Group));
    });
});
