import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Student } from "../../../../../src/core/entities/student";
import { User, UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { DeleteUser } from "../../../../../src/core/services/user/deleteUser";

describe("deleteStudent Service", () => {
    let deleteStudentService: DeleteUser;
    let userRepository: jest.Mocked<IUserRepository>;
    let params: { id: string; userType: UserType };

    beforeEach(() => {
        userRepository = {
            getById: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        deleteStudentService = new DeleteUser(userRepository);

        params = { id: "1", userType: UserType.STUDENT };
    });

    test("Should throw error if student not found in database", async () => {
        userRepository.delete.mockRejectedValue(new EntityNotFoundError("Student not found"));

        await expect(deleteStudentService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });

    test("Should return empty object if student is deleted", async () => {
        const student: Student = new Student("test@example.com", "  John  ", "  Doe  ", "hashedpassword123", "1");

        userRepository.getById.mockResolvedValue(student);
        userRepository.delete.mockResolvedValue(undefined);

        await expect(deleteStudentService.execute(params)).resolves.toEqual({});
        expect(userRepository.delete).toHaveBeenCalledWith(params.id);
    });
});
