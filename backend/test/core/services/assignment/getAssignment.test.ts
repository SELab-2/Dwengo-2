import { GetAssignment, GetAssignmentParams } from "../../../../src/core/services/assignment/getAssignment";
import { IAssignmentRepository } from "../../../../src/core/repositories/assignmentRepositoryInterface"; 
import { Assignment } from "../../../../src/core/entities/assignment";
import { EntityNotFoundError } from "../../../../src/config/error";

describe("getAssignment Service", () => {
  let getAssignmentService: GetAssignment;
  let getAssignmentParams: GetAssignmentParams;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;
  let date: Date

  beforeEach(() => {
    mockAssignmentRepository = {
      getById: jest.fn(), // Mock DB function
    } as unknown as jest.Mocked<IAssignmentRepository>;

    getAssignmentService = new GetAssignment(mockAssignmentRepository);

    getAssignmentParams = new GetAssignmentParams("1");

    date = new Date();
  });

  test("Should return assignment if found", async () => {
    const assignment = new Assignment(
      "1",
      "1",
      date,
      date,
      "extra_instructions",
      "1"
    );

    mockAssignmentRepository.getById.mockResolvedValue(assignment);
    const result = await getAssignmentService.execute(getAssignmentParams);

    expect(result).toEqual({
        id: "1",
        classId: "1",
        startDate: date,
        deadline: date,
        extraInstructions: "extra_instructions",
        learningPathId: "1"
    });
    expect(mockAssignmentRepository.getById).toHaveBeenCalledWith("1");
  });

  test("Should throw error", async () => {
    mockAssignmentRepository.getById.mockRejectedValue(new EntityNotFoundError("Assignment not found"));
    
    await expect(getAssignmentService.execute(getAssignmentParams)).rejects.toThrow();
    expect(mockAssignmentRepository.getById).toHaveBeenCalledWith("1");
  });
});