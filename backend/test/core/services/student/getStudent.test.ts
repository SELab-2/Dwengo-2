import { GetStudent } from "../../../../src/core/services/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("getStudent Service", () => {
  let getStudentService: GetStudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;

  beforeEach(() => {
    mockStudentRepository = {
      getStudentById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IStudentRepository>;

    getStudentService = new GetStudent(mockStudentRepository);
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
    const result = await getStudentService.execute("1");

    expect(result).toEqual({
      email: "test@student.com",
      firstName: "John",
      familyName: "Doe",
      schoolName: "Yale",
      id: "1"
    });
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockStudentRepository.getStudentById.mockRejectedValue(new EntityNotFoundError("Student not found"));
    
    await expect(getStudentService.execute("999")).rejects.toThrow();
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith("999");
  });
});