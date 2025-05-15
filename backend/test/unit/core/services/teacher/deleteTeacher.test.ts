import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { DeleteUser } from "../../../../../src/core/services/user/deleteUser";

describe("deleteTeacher Service", () => {
    let deleteTeacherService: DeleteUser;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let params: { id: string; userType: UserType };

    beforeEach(() => {
        mockUserRepository = {
            getById: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        deleteTeacherService = new DeleteUser(mockUserRepository);

        params = { id: "1", userType: UserType.TEACHER };
    });

    test("Should throw error if teacher not found in database", async () => {
        mockUserRepository.delete.mockRejectedValue(new EntityNotFoundError("Teacher not found"));

        await expect(deleteTeacherService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });

    test("Should return empty object if teacher is deleted", async () => {
        const teacher: Teacher = new Teacher("test@example.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        mockUserRepository.getById.mockResolvedValue(teacher);
        mockUserRepository.delete.mockResolvedValue(undefined);

        await expect(deleteTeacherService.execute(params)).resolves.toEqual({});
        expect(mockUserRepository.delete).toHaveBeenCalledWith(params.id);
    });
});
