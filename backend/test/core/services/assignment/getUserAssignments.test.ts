import { EntityNotFoundError } from "../../../../src/config/error";
import { Assignment } from "../../../../src/core/entities/assignment";
import { IAssignmentRepository } from "../../../../src/core/repositories/assignmentRepositoryInterface";
import { GetUserAssignments, GetUserAssignmentsParams } from "../../../../src/core/services/assignment";

const mockAssignmentRepository = {
  getAssignmentsByUserId: jest.fn()
} as unknown as jest.Mocked<IAssignmentRepository>;

describe("GetUserAssignments Service", () => {
  let userId: string;
  let params: GetUserAssignmentsParams;
  let getUserAssignments: GetUserAssignments;
  let assignments: Assignment[];
  let startDate: Date;
  let deadline: Date;

  beforeEach(() => {
    jest.clearAllMocks();
    userId = "1";
    params = new GetUserAssignmentsParams(userId);
    getUserAssignments = new GetUserAssignments(mockAssignmentRepository)
    startDate = new Date();
    deadline = new Date();
    assignments = [];
    for(let i=0; i++; i<5){
      let assignment = new Assignment(
        i.toString(),
        i.toString(),
        startDate,
        deadline,
        "Extra Instructions",
        i.toString()
      );
      assignments.push(assignment);
    }
  });

  test("Should return assignments of a user if found", async () => {
    mockAssignmentRepository.getAssignmentsByUserId.mockResolvedValue(assignments);

    const result = await getUserAssignments.execute(params);

    expect(result).toEqual({assignments: assignments});
    expect(mockAssignmentRepository.getAssignmentsByUserId).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.getAssignmentsByUserId).toHaveBeenCalledWith(params.id);
  });

  test("Should throw error if user not found", async () => {
    mockAssignmentRepository.getAssignmentsByUserId.mockRejectedValue(new EntityNotFoundError("User not found"));

    await expect(getUserAssignments.execute(params)).rejects.toThrow(EntityNotFoundError);
    expect(mockAssignmentRepository.getAssignmentsByUserId).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.getAssignmentsByUserId).toHaveBeenCalledWith(params.id);
  });
});