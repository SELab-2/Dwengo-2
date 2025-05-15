import { ErrorCode } from "../../../../../src/application/types";
import { Student } from "../../../../../src/core/entities/student";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { RemoveUserFromGroup } from "../../../../../src/core/services/user";

describe("RemoveStudentFromGroup", () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let removeStudentFromGroup: RemoveUserFromGroup;

    beforeEach(() => {
        userRepository = {
            getById: jest.fn(),
            removeFromGroup: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;
        removeStudentFromGroup = new RemoveUserFromGroup(userRepository);
    });

    it("should call removeStudentFromGroup on the repository with correct parameters", async () => {
        const id = "123";
        const idParent = "456";
        const params = { id, idParent };
        const student = new Student("student@gmail.com", "student", "test", "hash", "ugent", "123");

        userRepository.getById.mockResolvedValue(student);

        await removeStudentFromGroup.execute(params);

        expect(userRepository.removeFromGroup).toHaveBeenCalledWith(id, idParent);
        expect(userRepository.removeFromGroup).toHaveBeenCalledTimes(1);
    });

    it("should throw error when trying to remove a teacher from a group", async () => {
        userRepository.removeFromGroup.mockRejectedValue(new Error("Student not found"));
        const id = "123";
        const idParent = "456";
        const params = { id, idParent };
        const teacher = new Teacher("teacher@gmail.com", "teacher", "test", "hash", "ugent", "123");

        userRepository.getById.mockResolvedValue(teacher);

        await expect(removeStudentFromGroup.execute(params)).rejects.toEqual({
            code: ErrorCode.BAD_REQUEST,
            message: "Only students can be part of a group.",
        });
    });

    it("should handle errors thrown by the repository", async () => {
        userRepository.removeFromGroup.mockRejectedValue(new Error("Student not found"));
        const id = "123";
        const idParent = "456";
        const params = { id, idParent };
        const student = new Student("student@gmail.com", "student", "test", "hash", "ugent", "123");

        userRepository.getById.mockResolvedValue(student);

        await expect(removeStudentFromGroup.execute(params)).rejects.toThrow("Student not found");
    });
});
