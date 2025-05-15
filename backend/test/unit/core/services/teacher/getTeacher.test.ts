import { ApiError, ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Teacher } from "../../../../../src/core/entities/teacher";
import { UserType } from "../../../../../src/core/entities/user";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetUser } from "../../../../../src/core/services/user";

describe("getTeacher service", () => {
    let getTeacherService: GetUser;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            getById: jest.fn(), // Mock DB function
        } as unknown as jest.Mocked<IUserRepository>;

        getTeacherService = new GetUser(mockUserRepository);
    });

    test("Should return teacher if found", async () => {
        const teacher = new Teacher("test@teacher.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        const params = { id: "1", userType: UserType.TEACHER };

        mockUserRepository.getById.mockResolvedValue(teacher);
        const result = await getTeacherService.execute(params);

        expect(result).toEqual(teacher.toObject());
        expect(mockUserRepository.getById).toHaveBeenCalledWith("1");
    });

    test("Should throw error", async () => {
        mockUserRepository.getById.mockRejectedValue(new EntityNotFoundError("Teacher not found"));

        const params = { id: "999", userType: UserType.TEACHER };

        await expect(getTeacherService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(mockUserRepository.getById).toHaveBeenCalledWith("999");
    });
});
