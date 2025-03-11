import { GetStudent } from "../../../../src/core/services/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { AppError, EntityNotFoundError } from "../../../../src/config/error";
import { GetUserParams } from "../../../../src/core/services/user";

describe("getStudent Use Case", () => {
  let getStudentUseCase: GetStudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudent: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;

    getStudentUseCase = new GetStudent(mockStudentRepository);
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

    const params: GetUserParams = new GetUserParams("1");

    mockStudentRepository.getStudent.mockResolvedValue(student);
    const result = await getStudentUseCase.execute(params);

    expect(result).toEqual({
      email: "test@student.com",
      firstName: "John",
      familyName: "Doe",
      schoolName: "Yale",
      id: "1"
    });
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudent.mockRejectedValue(new EntityNotFoundError("Student not found"));
    
    const params: GetUserParams = new GetUserParams("999");

    await expect(getStudentUseCase.execute(params)).rejects.toThrow();
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("999");
  });
});