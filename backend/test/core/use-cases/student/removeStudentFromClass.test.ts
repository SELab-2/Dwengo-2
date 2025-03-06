import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { RemoveStudentFromClass } from "../../../../src/core/use-cases/student/removeStudentFromClass";


// TODO: Implement tests where we check if student was actually removed from class
describe("RemoveStudentFromClass", () => {
  let mockStudentRepository: jest.Mocked<StudentRepositoryInterface>;
  let removeStudentFromClass: RemoveStudentFromClass;

  beforeEach(() => {
    mockStudentRepository = {
      removeStudentFromClass: jest.fn()
    } as unknown as jest.Mocked<StudentRepositoryInterface>;;

    removeStudentFromClass = new RemoveStudentFromClass(mockStudentRepository);
  });

  it("should call removeStudentFromClass on the repository with correct parameters", async () => {
    const input = { studentId: "123", classId: "456" };

    await removeStudentFromClass.execute(input);

    expect(mockStudentRepository.removeStudentFromClass).toHaveBeenCalledWith("123", "456");
    expect(mockStudentRepository.removeStudentFromClass).toHaveBeenCalledTimes(1);
  });

  it("should handle errors thrown by the repository", async () => {
    mockStudentRepository.removeStudentFromClass.mockRejectedValue(new Error("Student not found"));
    const input = { studentId: "123", classId: "456" };

    await expect(removeStudentFromClass.execute(input)).rejects.toThrow("Student not found");
  });
});
