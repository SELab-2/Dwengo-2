import { DeleteStudent, DeleteStudentParams } from "../../../../src/core/use-cases/student/deleteStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { rejects } from "assert";

describe("getStudent Use Case", () => {
  let deleteStudentUseCase: DeleteStudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let params: DeleteStudentParams;

  beforeEach(() => {
    mockStudentRepository = {
      getStudent: jest.fn(),
      deleteStudent: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    deleteStudentUseCase = new DeleteStudent(mockStudentRepository);

    params = new DeleteStudentParams("1"); 
  });

test("Should throw error if student not found in database", async () => {
    mockStudentRepository.getStudent.mockResolvedValue(null);

    await expect(deleteStudentUseCase.execute(params)).rejects.toThrow("Student not found");
});

  test("Should return void if student is deleted", async () => {
    const student: Student = new Student(
        "test@example.com",
        "  John  ",
        "  Doe  ",
        "hashedpassword123",
        [],
        "1"
      );

    mockStudentRepository.getStudent.mockResolvedValue(student);
    mockStudentRepository.deleteStudent.mockResolvedValue(undefined);
    
    await expect(deleteStudentUseCase.execute(params)).resolves.toBeUndefined();
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith(params.getId());
    expect(mockStudentRepository.deleteStudent).toHaveBeenCalledWith(params.getId());
  });
});