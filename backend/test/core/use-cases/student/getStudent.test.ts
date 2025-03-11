import { GetSudent } from "../../../../src/core/use-cases/student/getStudent";
import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { AppError } from "../../../../src/config/error";

describe("getStudent Use Case", () => {
  let getStudentUseCase: GetSudent;
  let mockStudentRepository: jest.Mocked<StudentRepositoryInterface>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudentById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<StudentRepositoryInterface>;

    getStudentUseCase = new GetSudent(mockStudentRepository);
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

    mockStudentRepository.getStudentById.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudentById.mockRejectedValue(new AppError("Student not found", 404));
    
    await expect(getStudentUseCase.execute("999")).rejects.toThrow();
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("999");
  });
});