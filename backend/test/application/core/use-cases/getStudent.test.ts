import { GetSudent } from "../../../../src/core/use-cases/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";

describe("getStudent Use Case", () => {
  let getStudentUseCase: GetSudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudent: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;

    getStudentUseCase = new GetSudent(mockStudentRepository);
  });

  test("Should return student if found", async () => {
    const student: Student = {
      id: "1",
      email: "test@student.com",
      first_name: "John",
      family_name: "Doe",
      password_hash: "hashedpassword123",
    };

    mockStudentRepository.getStudent.mockResolvedValue(student);
    const result = await getStudentUseCase.execute("1");

    expect(result).toEqual(student);
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("1");
  });

  test("Should return null if student is not found", async () => {
    mockStudentRepository.getStudent.mockResolvedValue(null);
    const result = await getStudentUseCase.execute("999");

    expect(result).toBeNull();
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("999");
  });
});
