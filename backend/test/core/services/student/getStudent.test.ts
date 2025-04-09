import { ApiError, ErrorCode } from "../../../../src/application/types";
import { EntityNotFoundError } from "../../../../src/config/error";
import { Student } from "../../../../src/core/entities/student";
import { UserType } from "../../../../src/core/entities/user";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { GetUser } from "../../../../src/core/services/user/getUser";

describe("getStudent Service", () => {
    let getStudentService: GetUser;
    let mockStudentRepository: jest.Mocked<IStudentRepository>;
    let mockTeacherRepository: jest.Mocked<ITeacherRepository>;

    beforeEach(() => {
        mockStudentRepository = {
            getById: jest.fn(), // Mock DB function
        } as unknown as jest.Mocked<IStudentRepository>;
        mockTeacherRepository = {} as unknown as jest.Mocked<ITeacherRepository>;

        getStudentService = new GetUser(mockStudentRepository, mockTeacherRepository);
    });

    test("Should return student if found", async () => {
        const student = new Student("test@student.com", "John", "Doe", "hashedpassword123", "Yale", "1");

        const params = { id: "1", userType: UserType.STUDENT };

        mockStudentRepository.getById.mockResolvedValue(student);
        const result = await getStudentService.execute(params);

        expect(result).toEqual(student.toObject());
        expect(mockStudentRepository.getById).toHaveBeenCalledWith("1");
    });

    test("Should throw error", async () => {
        mockStudentRepository.getById.mockRejectedValue(new EntityNotFoundError("Student not found"));

        const params = { id: "999", userType: UserType.STUDENT };

        await expect(getStudentService.execute(params)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(mockStudentRepository.getById).toHaveBeenCalledWith("999");
    });
});
