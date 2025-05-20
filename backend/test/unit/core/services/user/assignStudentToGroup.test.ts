import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { AssignStudentToGroup } from "../../../../../src/core/services/user";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

describe("AssignStudentToGroup Service", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let assignStudentToGroup: AssignStudentToGroup;

    beforeEach(() => {
        userRepository = { assignToGroup: jest.fn() } as unknown as jest.Mocked<IUserRepository>;

        assignStudentToGroup = new AssignStudentToGroup(userRepository);
        mockValidateUserRights.mockResolvedValue();
    });

    it("should call assignStudentToGroup with correct parameters", async () => {
        const id = "student-123";
        const idParent = "group-456";
        const params = { id, idParent };

        await assignStudentToGroup.execute("", params);

        expect(userRepository.assignToGroup).toHaveBeenCalledTimes(1);
        expect(userRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });

    it("should throw an error if the student or group does not exist", async () => {
        userRepository.assignToGroup.mockRejectedValue(new EntityNotFoundError("Student or group not found"));

        const id = "nonexistent-student";
        const idParent = "group-456";
        const params = { id, idParent };

        await expect(assignStudentToGroup.execute("", params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(userRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });

    it("should throw an error if the repository encounters an unexpected error", async () => {
        userRepository.assignToGroup.mockRejectedValue(new Error("Database error"));

        const id = "student-123";
        const idParent = "group-456";
        const params = { id, idParent };

        await expect(assignStudentToGroup.execute("", params)).rejects.toThrow("Database error");
        expect(userRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });
});
