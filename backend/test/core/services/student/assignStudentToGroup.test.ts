import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { AssignStudentToGroup, AssignStudentToGroupParams } from "../../../../src/core/services/user";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("AssignStudentToGroup Service", () => {
    let studentRepository: jest.Mocked<IStudentRepository>;
    let assignStudentToGroup: AssignStudentToGroup;

    beforeEach(() => {
        studentRepository = { assignStudentToGroup: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;

        assignStudentToGroup = new AssignStudentToGroup(studentRepository);
    });

    it("should call assignStudentToGroup with correct parameters", async () => {
        const studentId = "student-123";
        const groupId = "group-456";
        const params = new AssignStudentToGroupParams(studentId, groupId);

        await assignStudentToGroup.execute(params);

        expect(studentRepository.assignStudentToGroup).toHaveBeenCalledTimes(1);
        expect(studentRepository.assignStudentToGroup).toHaveBeenCalledWith(studentId, groupId);
    });

    it("should throw an error if the student or group does not exist", async () => {
        studentRepository.assignStudentToGroup.mockRejectedValue(new EntityNotFoundError("Student or group not found"));

        const studentId = "nonexistent-student";
        const groupId = "group-456";
        const params = new AssignStudentToGroupParams(studentId, groupId);

        await expect(assignStudentToGroup.execute(params)).rejects.toThrow(EntityNotFoundError);
        expect(studentRepository.assignStudentToGroup).toHaveBeenCalledWith(studentId, groupId);
    });

    it("should throw an error if the repository encounters an unexpected error", async () => {
        studentRepository.assignStudentToGroup.mockRejectedValue(new Error("Database error"));

        const studentId = "student-123";
        const groupId = "group-456";
        const params = new AssignStudentToGroupParams(studentId, groupId);

        await expect(assignStudentToGroup.execute(params)).rejects.toThrow("Database error");
        expect(studentRepository.assignStudentToGroup).toHaveBeenCalledWith(studentId, groupId);
    });
});
