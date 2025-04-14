import { ApiError, ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../../src/core/repositories/teacherRepositoryInterface";
import { GetUser } from "../../../../../src/core/services/user";

describe("getTeacher service", () => {
    let getTeacherService: GetUser;
    let mockStudentRepository: jest.Mocked<IStudentRepository>;
    let mockTeacherRepository: jest.Mocked<ITeacherRepository>;

    beforeEach(() => {
        mockTeacherRepository = {
            getById: jest.fn(), // Mock DB function
        } as unknown as jest.Mocked<ITeacherRepository>;
        mockStudentRepository = {
            getById: jest.fn(), // Mock DB function
        } as unknown as jest.Mocked<IStudentRepository>;

        getTeacherService = new GetUser(mockStudentRepository, mockTeacherRepository);
    });

    test("Should return teacher if found", async () => {
        const teacher = new Teacher("test@teacher.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        const params = { id: "1", userType: UserType.TEACHER };

        mockTeacherRepository.getById.mockResolvedValue(teacher);
        const result = await getTeacherService.execute(params);

        expect(result).toEqual(teacher.toObject());
        expect(mockTeacherRepository.getById).toHaveBeenCalledWith("1");
    });

    test("Should throw error", async () => {
        mockTeacherRepository.getById.mockRejectedValue(new EntityNotFoundError("Teacher not found"));

        const params = { id: "999", userType: UserType.TEACHER };

        await expect(getTeacherService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(mockTeacherRepository.getById).toHaveBeenCalledWith("999");
    });
});
