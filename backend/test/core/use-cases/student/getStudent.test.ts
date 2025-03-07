import { GetSudent } from "../../../../src/core/use-cases/student/getStudent";
import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { AppError } from "../../../../src/config/error";

describe("getStudent Use Case", () => {
  let getStudentUseCase: GetSudent;
  let mockStudentRepository: jest.Mocked<StudentRepositoryInterface>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudent: jest.fn(), // Mock DB function
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
      [] as string[],
      "1"
    );

    mockStudentRepository.getStudent.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudent.mockRejectedValue(new AppError("Student not found", 404));
    
    await expect(getStudentUseCase.execute("999")).rejects.toThrow();
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("999");
  });
});