import { Assignment } from "../../../../../src/core/entities/assignment";
import { LearningPath } from "../../../../../src/core/entities/learningPath";
import { Submission } from "../../../../../src/core/entities/submission";
import { GetUserProgress } from "../../../../../src/core/services/progress";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repositories
const assignmentRepository = { getByUserId: jest.fn() };
const learningPathRepository = { getLearningPath: jest.fn() };
const submissionRepository = { getAllForStudentInAssignment: jest.fn() };

// Mock inheritance base class constructor
class TestableGetUserProgress extends GetUserProgress {
  constructor() {
    super(submissionRepository as any, assignmentRepository as any, learningPathRepository as any);
  }
}

describe("GetUserProgress", () => {
  it("returns correct progress for a user with multiple assignments and submissions", async () => {
    mockValidateUserRights.mockResolvedValue();
    const mockAssignments: Assignment[] = [
      { id: "a1", learningPathId: "lp1" } as Assignment,
      { id: "a2", learningPathId: "lp2" } as Assignment,
    ];

    const mockLearningPaths: LearningPath[] = [
      {
        id: "lp1",
        numNodes: 3,
        nodes: [{ hruid: "n1" }, { hruid: "n2" }, { hruid: "n3" }],
      },
      {
        id: "lp2",
        numNodes: 2,
        nodes: [{ hruid: "m1" }, { hruid: "m2" }],
      },
    ] as LearningPath[];

    const mockSubmissions: Submission[][] = [
      [
        {
          id: "s1",
          learningObjectId: "n1",
          studentId: "u1",
          assignmentId: "a1",
          time: new Date("2024-01-01"),
        },
        {
          id: "s2",
          learningObjectId: "n2",
          studentId: "u1",
          assignmentId: "a1",
          time: new Date("2024-01-02"),
        },
        {
          id: "s3",
          learningObjectId: "n2",
          studentId: "u1",
          assignmentId: "a1",
          time: new Date("2024-01-03"),
        },
      ],
      [
        {
          id: "s4",
          learningObjectId: "m1",
          studentId: "u1",
          assignmentId: "a2",
          time: new Date("2024-01-01"),
        },
      ],
    ] as Submission[][];

    // Mock return values
    assignmentRepository.getByUserId.mockResolvedValue(mockAssignments);
    learningPathRepository.getLearningPath.mockImplementation((id: string) => {
      return id === "lp1" ? mockLearningPaths[0] : mockLearningPaths[1];
    });
    submissionRepository.getAllForStudentInAssignment.mockImplementation((studentId: string, assignmentId: string) => {
      return assignmentId === "a1" ? mockSubmissions[0] : mockSubmissions[1];
    });

    const service = new TestableGetUserProgress();
    const result = await service.execute("", { idParent: "u1" });

    expect(result).toEqual({
      progresses: [
        {
          id: "s3", // latest submission on node2
          studentId: "u1",
          assignmentId: "a1",
          learningObjectId: "n2",
          time: new Date("2024-01-03"),
          step: 2,
          maxStep: 3,
        },
        {
          id: "s4",
          studentId: "u1",
          assignmentId: "a2",
          learningObjectId: "m1",
          time: new Date("2024-01-01"),
          step: 1,
          maxStep: 2,
        },
      ],
    });
  });

  it("returns correct progress if no submissions are present", async () => {
    assignmentRepository.getByUserId.mockResolvedValue([
      { id: "a1", learningPathId: "lp1" } as Assignment,
    ]);
    learningPathRepository.getLearningPath.mockResolvedValue({
      id: "lp1",
      numNodes: 2,
      nodes: [{ hruid: "n1" }, { hruid: "n2" }],
    });
    submissionRepository.getAllForStudentInAssignment.mockResolvedValue([]);

    const service = new TestableGetUserProgress();
    const result = await service.execute("", { idParent: "u1" });

    expect(result).toEqual({
      progresses: [
        {
          id: null,
          studentId: "u1",
          assignmentId: "a1",
          learningObjectId: null,
          time: null,
          step: 0,
          maxStep: 2,
        },
      ],
    });
  });
});
