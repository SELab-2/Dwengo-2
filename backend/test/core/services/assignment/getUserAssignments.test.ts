import { EntityNotFoundError } from "../../../../src/config/error";
import { Assignment } from "../../../../src/core/entities/assignment";
import { IAssignmentRepository } from "../../../../src/core/repositories/assignmentRepositoryInterface";
import { GetUserAssignments, GetUserAssignmentsInput } from "../../../../src/core/services/assignment";

const mockAssignmentRepository = {
  getByUserId: jest.fn()
} as unknown as jest.Mocked<IAssignmentRepository>;

describe("GetUserAssignments Service", () => {
  let idParent: string;
  let params: GetUserAssignmentsInput;
  let getUserAssignments: GetUserAssignments;
  let assignments: Assignment[];
  let startDate: Date;
  let deadline: Date;

  beforeEach(() => {
    jest.clearAllMocks();
    idParent = "1";
    params = {idParent: idParent};
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
    mockAssignmentRepository.getByUserId.mockResolvedValue(assignments);

    const result = await getUserAssignments.execute(params);

    expect(result).toEqual({assignments: assignments.map(a => a.id)});
    expect(mockAssignmentRepository.getByUserId).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.getByUserId).toHaveBeenCalledWith(params.idParent);
  });

  test("Should throw error if user not found", async () => {
    mockAssignmentRepository.getByUserId.mockRejectedValue(new EntityNotFoundError("User not found"));

    await expect(getUserAssignments.execute(params)).rejects.toThrow(EntityNotFoundError);
    expect(mockAssignmentRepository.getByUserId).toHaveBeenCalledTimes(1);
    expect(mockAssignmentRepository.getByUserId).toHaveBeenCalledWith(params.idParent);
  });
});