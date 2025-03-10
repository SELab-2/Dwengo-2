import { IStudentRepository } from "../../../../src/core/repositories/studentRepositoryInterface";
import { RemoveStudentFromGroup } from "../../../../src/core/services/student/removeStudentFromGroup";
import { RemoveStudentFromParams } from "../../../../src/core/services/student/removeStudentFrom";


// TODO: Implement tests where we check if student was actually removed from class
describe("RemoveStudentFromGroup", () => {
  let mockStudentRepository: jest.Mocked<IStudentRepository>;
  let removeStudentFromGroup: RemoveStudentFromGroup;

  beforeEach(() => {
    mockStudentRepository = {
      removeStudentFromGroup: jest.fn()
    } as unknown as jest.Mocked<IStudentRepository>;;

    removeStudentFromGroup = new RemoveStudentFromGroup(mockStudentRepository);
  });

  it("should call removeStudentFromGroup on the repository with correct parameters", async () => {
    const params = new RemoveStudentFromParams("123", "456");

    await removeStudentFromGroup.execute(params);

    expect(mockStudentRepository.removeStudentFromGroup).toHaveBeenCalledWith("123", "456");
    expect(mockStudentRepository.removeStudentFromGroup).toHaveBeenCalledTimes(1);
  });

  it("should handle errors thrown by the repository", async () => {
    mockStudentRepository.removeStudentFromGroup.mockRejectedValue(new Error("Student not found"));
    const params = new RemoveStudentFromParams("123", "456");

    await expect(removeStudentFromGroup.execute(params)).rejects.toThrow("Student not found");
  });
});