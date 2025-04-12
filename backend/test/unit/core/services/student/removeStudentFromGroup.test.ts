import { ErrorCode } from "../../../../../src/application/types";
import { UserType } from "../../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { RemoveUserFromGroup } from "../../../../../src/core/services/user";

describe("RemoveStudentFromGroup", () => {
    let mockStudentRepository: jest.Mocked<IStudentRepository>;
    let removeStudentFromGroup: RemoveUserFromGroup;

    beforeEach(() => {
        mockStudentRepository = {
            removeFromGroup: jest.fn(),
        } as unknown as jest.Mocked<IStudentRepository>;
        removeStudentFromGroup = new RemoveUserFromGroup(mockStudentRepository);
    });

    it("should call removeStudentFromGroup on the repository with correct parameters", async () => {
        const id = "123";
        const idParent = "456";
        const userType = UserType.STUDENT;
        const params = { id, idParent, userType };

        await removeStudentFromGroup.execute(params);

        expect(mockStudentRepository.removeFromGroup).toHaveBeenCalledWith(id, idParent);
        expect(mockStudentRepository.removeFromGroup).toHaveBeenCalledTimes(1);
    });

    it("should throw error when trying to remove a teacher from a group", async () => {
        mockStudentRepository.removeFromGroup.mockRejectedValue(new Error("Student not found"));
        const id = "123";
        const idParent = "456";
        const userType = UserType.TEACHER;
        const params = { id, idParent, userType };

        await expect(removeStudentFromGroup.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Only students can be part of a group.",
        });
    });

    it("should handle errors thrown by the repository", async () => {
        mockStudentRepository.removeFromGroup.mockRejectedValue(new Error("Student not found"));
        const id = "123";
        const idParent = "456";
        const userType = UserType.STUDENT;
        const params = { id, idParent, userType };

        await expect(removeStudentFromGroup.execute(params)).rejects.toThrow("Student not found");
    });
});
