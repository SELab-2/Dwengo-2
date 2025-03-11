import { GetStudent } from "../../../../src/core/services/student/getStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { AppError, EntityNotFoundError } from "../../../../src/config/error";
import { GetUserParams } from "../../../../src/core/services/user";

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

    const params: GetUserParams = new GetUserParams("1");

    mockStudentRepository.getStudentById.mockResolvedValue(student);
    const result = await getStudentService.execute(params);

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
    
    const params: GetUserParams = new GetUserParams("999");

    await expect(getStudentService.execute(params)).rejects.toThrow();
    expect(mockStudentRepository.getStudent).toHaveBeenCalledWith("999");
  });
});