import { ErrorCode } from "../../../../src/application/types";
import { EntityNotFoundError } from "../../../../src/config/error";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { AssignStudentToGroup } from "../../../../src/core/services/user";

describe("AssignStudentToGroup Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let assignStudentToGroup: AssignStudentToGroup;

    beforeEach(() => {
        studentRepository = { assignToGroup: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;

        assignStudentToGroup = new AssignStudentToGroup(studentRepository);
    });

    it("should call assignStudentToGroup with correct parameters", async () => {
        const id = "student-123";
        const idParent = "group-456";
        const params = { id, idParent };

        await assignStudentToGroup.execute(params);

        expect(studentRepository.assignToGroup).toHaveBeenCalledTimes(1);
        expect(studentRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });

    it("should throw an error if the student or group does not exist", async () => {
        studentRepository.assignToGroup.mockRejectedValue(new EntityNotFoundError("Student or group not found"));

        const id = "nonexistent-student";
        const idParent = "group-456";
        const params = { id, idParent };

        await expect(assignStudentToGroup.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(studentRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });

    it("should throw an error if the repository encounters an unexpected error", async () => {
        studentRepository.assignToGroup.mockRejectedValue(new Error("Database error"));

        const id = "student-123";
        const idParent = "group-456";
        const params = { id, idParent };

        await expect(assignStudentToGroup.execute(params)).rejects.toThrow("Database error");
        expect(studentRepository.assignToGroup).toHaveBeenCalledWith(id, idParent);
    });
});
