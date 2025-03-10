import { GetStudent } from "../../../../src/core/use-cases/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { EntityNotFoundError } from "../../../../src/config/error";

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
      "1"
    );

    mockStudentRepository.getStudent.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });

  test("Should throw EntityNotFoundError if student not found", async () => {
    mockStudentRepository.getStudent.mockRejectedValue(
      new EntityNotFoundError("Student not found")
    );

    await expect(getStudentUseCase.execute("1")).rejects.toThrow(
      "Student not found"
    );
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });
});