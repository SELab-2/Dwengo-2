import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../../src/core/repositories/teacherRepositoryInterface";
import { DeleteUser } from "../../../../../src/core/services/user/deleteUser";

describe("deleteTeacher Service", () => {
    let deleteTeacherService: DeleteUser;
    let mockStudentRepository: jest.Mocked<IStudentRepository>;
    let mockTeacherRepository: jest.Mocked<ITeacherRepository>;
    let params: { id: string; userType: UserType };

    beforeEach(() => {
        mockTeacherRepository = {
            getById: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<ITeacherRepository>;
        mockStudentRepository = {
            getById: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IStudentRepository>;

        deleteTeacherService = new DeleteUser(mockStudentRepository, mockTeacherRepository);

        params = { id: "1", userType: UserType.TEACHER };
    });

    test("Should throw error if teacher not found in database", async () => {
        mockTeacherRepository.delete.mockRejectedValue(new EntityNotFoundError("Teacher not found"));

        await expect(deleteTeacherService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });

    test("Should return empty object if teacher is deleted", async () => {
        const teacher: Teacher = new Teacher("test@example.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        mockTeacherRepository.getById.mockResolvedValue(teacher);
        mockTeacherRepository.delete.mockResolvedValue(undefined);

        await expect(deleteTeacherService.execute(params)).resolves.toEqual({});
        expect(mockTeacherRepository.delete).toHaveBeenCalledWith(params.id);
    });
});
