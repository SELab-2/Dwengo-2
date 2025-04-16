import { Assignment } from "../../../../../src/core/entities/assignment";
import { Submission } from "../../../../../src/core/entities/submission";
import { User } from "../../../../../src/core/entities/user";
import { IAssignmentRepository } from "../../../../../src/core/repositories/assignmentRepositoryInterface";
import { ILearningPathRepository } from "../../../../../src/core/repositories/learningPathRepositoryInterface";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ISubmissionRepository } from "../../../../../src/core/repositories/submissionRepositoryInterface";
import { GetAssignmentProgress } from "../../../../../src/core/services/progress";


// Mock data
const mockUsers: User[] = [
  { id: "student1" } as User,
  { id: "student2" } as User,
];

const mockAssignment: Assignment = {
  id: "assignment1",
  learningPathId: "lp1",
} as Assignment;

const mockLearningPath = {
  numNodes: 3,
  nodes: [
    { hruid: "node1" },
    { hruid: "node2" },
    { hruid: "node3" },
  ],
};

const mockSubmissions: Submission[] = [
  {
    id: "sub1",
    studentId: "student1",
    learningObjectId: "node1",
    time: new Date("2023-01-01"),
  },
  {
    id: "sub2",
    studentId: "student1",
    learningObjectId: "node2",
    time: new Date("2023-01-02"),
  },
  {
    id: "sub3",
    studentId: "student2",
    learningObjectId: "node1",
    time: new Date("2023-01-03"),
  },
] as Submission[];

// Mocks
const studentRepository: jest.Mocked<IStudentRepository> = {
  getByAssignmentId: jest.fn().mockResolvedValue(mockUsers),
} as any;

const submissionRepository: jest.Mocked<ISubmissionRepository> = {
  getAllForStudentInAssignment: jest.fn().mockImplementation((studentId: string) => {
    return Promise.resolve(mockSubmissions.filter((s) => s.studentId === studentId));
  }),
} as any;

const assignmentRepository: jest.Mocked<IAssignmentRepository> = {
  getById: jest.fn().mockResolvedValue(mockAssignment),
} as any;

const learningPathRepository: jest.Mocked<ILearningPathRepository> = {
  getLearningPath: jest.fn().mockResolvedValue(mockLearningPath),
} as any;

describe("GetProgress", () => {
  it("should return correct progress for students", async () => {
    const service = new GetAssignmentProgress(
      studentRepository,
      submissionRepository,
      assignmentRepository,
      learningPathRepository
    );

    const input = {
      idParent: "assignment1",
    };

    const result = await service.execute(input) as { progresses: object[] };

    expect(result.progresses).toHaveLength(2);
    expect(result.progresses[0]).toMatchObject({
      studentId: "student1",
      assignmentId: "assignment1",
      learningObjectId: "node2",
      step: 2,
      maxStep: 3,
    });
    expect(result.progresses[1]).toMatchObject({
      studentId: "student2",
      assignmentId: "assignment1",
      learningObjectId: "node1",
      step: 1,
      maxStep: 3,
    });
  });

  it("should return empty progress list if there are no students", async () => {
    studentRepository.getByAssignmentId.mockResolvedValueOnce([]);
  
    const service = new GetAssignmentProgress(
      studentRepository,
      submissionRepository,
      assignmentRepository,
      learningPathRepository
    );
  
    const result = await service.execute({ idParent: "assignment1" }) as { progresses: object[] };
  
    expect(result.progresses).toEqual([]);
  });

  it("should handle students with no submissions", async () => {
    studentRepository.getByAssignmentId.mockResolvedValueOnce(mockUsers);
    submissionRepository.getAllForStudentInAssignment.mockResolvedValue([]);
  
    const service = new GetAssignmentProgress(
      studentRepository,
      submissionRepository,
      assignmentRepository,
      learningPathRepository
    );
  
    const result = await service.execute({ idParent: "assignment1" }) as {
        progresses: {
            id: string | null,
            step: number,
            learningObjectId: string | null,
        } [] 
    };
  
    expect(result.progresses).toHaveLength(2);
    for (const progress of result.progresses) {
        console.log(progress);
      expect(progress.id).toBeNull();
      expect(progress.step).toBe(0);
      expect(progress.learningObjectId).toBeNull();
    }
  });
  
  it("should pick latest submission for the furthest step", async () => {
    const doubleSub = [
      {
        id: "old",
        studentId: "student1",
        learningObjectId: "node2",
        time: new Date("2023-01-01"),
      },
      {
        id: "latest",
        studentId: "student1",
        learningObjectId: "node2",
        time: new Date("2023-01-03"),
      },
    ] as Submission[];
  
    studentRepository.getByAssignmentId.mockResolvedValueOnce([mockUsers[0]]);
    submissionRepository.getAllForStudentInAssignment.mockResolvedValue(doubleSub);
  
    const service = new GetAssignmentProgress(
      studentRepository,
      submissionRepository,
      assignmentRepository,
      learningPathRepository
    );
  
    const result = await service.execute({ idParent: "assignment1" })  as {
        progresses: {
            id: string | null,
            step: number,
        } [] 
    };
  
    expect(result.progresses[0].id).toBe("latest");
    expect(result.progresses[0].step).toBe(2); // node2 = index 1 + 1
  });
  
  it("should pick one submission if two have the same time on same node", async () => {
    const sameTime = new Date("2023-01-04");
  
    const twinSubs: Submission[] = [
      {
        id: "subA",
        studentId: "student1",
        learningObjectId: "node2",
        time: sameTime,
      },
      {
        id: "subB",
        studentId: "student1",
        learningObjectId: "node2",
        time: sameTime,
      },
    ] as Submission[];
  
    studentRepository.getByAssignmentId.mockResolvedValueOnce([mockUsers[0]]);
    submissionRepository.getAllForStudentInAssignment.mockResolvedValueOnce(twinSubs);
  
    const service = new GetAssignmentProgress(
      studentRepository,
      submissionRepository,
      assignmentRepository,
      learningPathRepository
    );
  
    const result = await service.execute({ idParent: "assignment1" }) as {
        progresses: {
            id: string | null,
        } [] 
    };
  
    const chosenId = result.progresses[0].id;
    expect(["subA", "subB"]).toContain(chosenId);
  });
  
});
