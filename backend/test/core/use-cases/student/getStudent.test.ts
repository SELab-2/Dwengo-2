import { GetSudent } from "../../../../src/core/use-cases/student/getStudent";
import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";

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
      [],
      "1"
    );

    mockStudentRepository.getStudent.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });
});