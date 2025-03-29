import { GetUser } from "../../../../src/core/services/user/getUser";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { EntityNotFoundError } from "../../../../src/config/error";
import { ITeacherRepository } from "../../../../src/core/repositories/teacherRepositoryInterface";
import { UserType } from "../../../../src/core/entities/user";
import { ApiError, ErrorCode } from "../../../../src/application/types";

describe("getStudent Service", () => {
  let getStudentService: GetUser;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let mockTeacherRepository: jest.Mocked<ITeacherRepository>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudentById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;
    mockTeacherRepository = {} as unknown as jest.Mocked<ITeacherRepository>;

    getStudentService = new GetUser(mockStudentRepository, mockTeacherRepository);
  });

  test("Should return student if found", async () => {
    const student = new Student(
      "test@student.com",
      "John",
      "Doe",
      "hashedpassword123",
      "Yale",
      "1"
    );

    const params = {id: "1", userType: UserType.STUDENT};

    mockStudentRepository.getStudentById.mockResolvedValue(student);
    const result = await getStudentService.execute(params);

    expect(result).toEqual(student.toObject());
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudentById.mockRejectedValue(new EntityNotFoundError("Student not found"));
    
    const params = {id: "999", userType: UserType.STUDENT};

    await expect(getStudentService.execute(params)).rejects.toEqual({
      code: ErrorCode.NOT_FOUND,
      message:  `User ${UserType.STUDENT} with ID 999 not found`,
    } as ApiError);
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("999");
  });
});