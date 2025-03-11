import { DeleteStudent, DeleteStudentParams } from "../../../../src/core/services/student/deleteStudent";
import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { Student } from "../../../../src/core/entities/student";
import { rejects } from "assert";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("deleteStudent Service", () => {
  let deleteStudentService: DeleteStudent;
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let params: DeleteStudentParams;

  beforeEach(() => {
    mockStudentRepository = {
      getStudentById: jest.fn(),
      deleteStudentById: jest.fn(),
    } as unknown as jest.Mocked<IStudentRepository>;

    deleteStudentService = new DeleteStudent(mockStudentRepository);

    params = new DeleteStudentParams("1"); 
  });

test("Should throw error if student not found in database", async () => {
    mockStudentRepository.getStudentById.mockRejectedValue(new EntityNotFoundError("Student not found"));

    await expect(deleteStudentService.execute(params)).rejects.toThrow("Student not found");
});

  test("Should return empty object if student is deleted", async () => {
    const student: Student = new Student(
        "test@example.com",
        "  John  ",
        "  Doe  ",
        "hashedpassword123",
        "1"
      );

    mockStudentRepository.getStudentById.mockResolvedValue(student);
    mockStudentRepository.deleteStudentById.mockResolvedValue(undefined);
    
    await expect(deleteStudentService.execute(params)).resolves.toEqual({});
    expect(mockStudentRepository.getStudentById).toHaveBeenCalledWith(params.getId());
    expect(mockStudentRepository.deleteStudentById).toHaveBeenCalledWith(params.getId());
  });
});