import { UpdateStudent } from "../../../../src/core/use-cases/student/updateStudent";
import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("UpdateStudent Use Case", () => {
  let updateStudentUseCase: UpdateStudent;
  let mockStudentRepository: jest.Mocked<StudentRepositoryInterface>;

  beforeEach(() => {
    mockStudentRepository = {
      updateStudent: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<StudentRepositoryInterface>;

    updateStudentUseCase = new UpdateStudent(mockStudentRepository);
  });

  test("Should update student if present in the DB", async () => {
    const student = new Student(
      "test@student.com",
      "John",
      "Doe",
      "hashedpassword123",
      [],
      "1"
    );

    mockStudentRepository.updateStudent.mockResolvedValue();

    await expect(updateStudentUseCase.execute(student)).resolves.toBeUndefined();
    expect(mockStudentRepository.updateStudent).toHaveBeenCalledWith(student);
  });

  test("Should throw error if student is not present in the DB", async () => {
    const student = new Student(
      "test@student.com",
      "John",
      "Doe",
      "hashedpassword123",
      [],
      "999"
    );

    mockStudentRepository.updateStudent.mockRejectedValue(new EntityNotFoundError("Student not found"));

    await expect(updateStudentUseCase.execute(student)).rejects.toThrow(EntityNotFoundError);
    expect(mockStudentRepository.updateStudent).toHaveBeenCalledWith(student);
  });
});