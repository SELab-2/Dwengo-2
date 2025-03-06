import { StudentRepositoryInterface } from "../../../../src/core/repositories/studentRepositoryInterface";
import { RemoveStudentFromGroup } from "../../../../src/core/use-cases/student/removeStudentFromGroup";


// TODO: Implement tests where we check if student was actually removed from class
describe("RemoveStudentFromGroup", () => {
  let mockStudentRepository: jest.Mocked<StudentRepositoryInterface>;
  let removeStudentFromGroup: RemoveStudentFromGroup;

  beforeEach(() => {
    mockStudentRepository = {
      removeStudentFromGroup: jest.fn()
    } as unknown as jest.Mocked<StudentRepositoryInterface>;;

    removeStudentFromGroup = new RemoveStudentFromGroup(mockStudentRepository);
  });

  it("should call removeStudentFromGroup on the repository with correct parameters", async () => {
    const input = { studentId: "123", groupId: "456" };

    await removeStudentFromGroup.execute(input);

    expect(mockStudentRepository.removeStudentFromGroup).toHaveBeenCalledWith("123", "456");
    expect(mockStudentRepository.removeStudentFromGroup).toHaveBeenCalledTimes(1);
  });

  it("should handle errors thrown by the repository", async () => {
    mockStudentRepository.removeStudentFromGroup.mockRejectedValue(new Error("Student not found"));
    const input = { studentId: "123", groupId: "456" };

    await expect(removeStudentFromGroup.execute(input)).rejects.toThrow("Student not found");
  });
});