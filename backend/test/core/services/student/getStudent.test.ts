import { GetStudent } from "../../../../src/core/services/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { AppError, EntityNotFoundError } from "../../../../src/config/error";

describe("getStudent Use Case", () => {
  let getStudentUseCase: GetStudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;

  beforeEach(() => {
    mockStudentRepository = {
<<<<<<< HEAD:backend/test/core/use-cases/student/getStudent.test.ts
      getStudentById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<StudentRepositoryInterface>;
=======
      getStudent: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;
>>>>>>> development:backend/test/core/services/student/getStudent.test.ts

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

    mockStudentRepository.getStudentById.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

<<<<<<< HEAD:backend/test/core/use-cases/student/getStudent.test.ts
    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudentById.mockRejectedValue(new AppError("Student not found", 404));
=======
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
>>>>>>> development:backend/test/core/services/student/getStudent.test.ts
    
    await expect(getStudentUseCase.execute("999")).rejects.toThrow();
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("999");
  });
});