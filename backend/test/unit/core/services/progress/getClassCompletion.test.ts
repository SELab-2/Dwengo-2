import { Assignment } from "../../../../../src/core/entities/assignment";
import { LearningPath } from "../../../../../src/core/entities/learningPath";
import { Student } from "../../../../../src/core/entities/student";
import { Submission } from "../../../../../src/core/entities/submission";
import { IAssignmentRepository } from "../../../../../src/core/repositories/assignmentRepositoryInterface";
import { IClassRepository } from "../../../../../src/core/repositories/classRepositoryInterface";
import { ILearningPathRepository } from "../../../../../src/core/repositories/learningPathRepositoryInterface";
import { IStudentRepository } from "../../../../../src/core/repositories/studentRepositoryInterface";
import { ISubmissionRepository } from "../../../../../src/core/repositories/submissionRepositoryInterface";
import { GetClassCompletion } from "../../../../../src/core/services/progress/getClassCompletion";


const mockSubmissionRepository: jest.Mocked<ISubmissionRepository> = {
    getAllForStudentInAssignment: jest.fn()
} as any;

const mockClassRepository: jest.Mocked<IClassRepository> = {} as any;

const mockStudentRepository: jest.Mocked<IStudentRepository> = {
    getByAssignmentId: jest.fn()
} as any;

const mockAssignmentRepository: jest.Mocked<IAssignmentRepository> = {
    getByClassId: jest.fn()
} as any;

const mockLearningPathRepository: jest.Mocked<ILearningPathRepository> = {
    getLearningPath: jest.fn()
} as any;

describe("GetClassCompletion", () => {
    const service = new GetClassCompletion(
        mockSubmissionRepository,
        mockClassRepository,
        mockStudentRepository,
        mockAssignmentRepository,
        mockLearningPathRepository
    );

    const input = {
        idParent: "class-1"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return percentage completion for a class", async () => {
        const assignment: Assignment = {
            id: "assignment-1",
            learningPathId: "lp-1"
        } as any;

        const student: Student = {
            id: "student-1"
        } as any;

        const learningPath: LearningPath = {
            id: "lp-1",
            numNodes: 3,
            nodes: [{ hruid: "node-1" }, { hruid: "node-2" }, { hruid: "node-3" }]
        } as any;

        const submissions: Submission[] = [
            { learningObjectId: "node-2" } as any
        ];

        mockAssignmentRepository.getByClassId.mockResolvedValue([assignment]);
        mockLearningPathRepository.getLearningPath.mockResolvedValue(learningPath);
        mockStudentRepository.getByAssignmentId.mockResolvedValue([student]);
        mockSubmissionRepository.getAllForStudentInAssignment.mockResolvedValue(submissions);

        const result = await service.execute(input);
        expect(result).toEqual({ percentage: 66.67 }); // 2 steps out of 3
    });

    it("should return null if there are no assignments", async () => {
        mockAssignmentRepository.getByClassId.mockResolvedValue([]);
        const result = await service.execute(input);
        expect(result).toEqual({ percentage: null });
    });

    it("should handle students with no submissions", async () => {
        const assignment: Assignment = {
            id: "assignment-1",
            learningPathId: "lp-1"
        } as any;

        const student: Student = {
            id: "student-1"
        } as any;

        const learningPath: LearningPath = {
            id: "lp-1",
            numNodes: 2,
            nodes: [{ hruid: "node-1" }, { hruid: "node-2" }]
        } as any;

        mockAssignmentRepository.getByClassId.mockResolvedValue([assignment]);
        mockLearningPathRepository.getLearningPath.mockResolvedValue(learningPath);
        mockStudentRepository.getByAssignmentId.mockResolvedValue([student]);
        mockSubmissionRepository.getAllForStudentInAssignment.mockResolvedValue([]);

        const result = await service.execute(input);
        expect(result).toEqual({ percentage: 0 });
    });

    it("should correctly round percentages", async () => {
        // 1 student finishes 2 out of 4 steps
        const assignment: Assignment = {
            id: "assignment-1",
            learningPathId: "lp-1"
        } as any;

        const student: Student = {
            id: "student-1"
        } as any;

        const learningPath: LearningPath = {
            id: "lp-1",
            numNodes: 4,
            nodes: [
                { hruid: "node-1" },
                { hruid: "node-2" },
                { hruid: "node-3" },
                { hruid: "node-4" }
            ]
        } as any;

        const submissions: Submission[] = [
            { learningObjectId: "node-2" } as any
        ];

        mockAssignmentRepository.getByClassId.mockResolvedValue([assignment]);
        mockLearningPathRepository.getLearningPath.mockResolvedValue(learningPath);
        mockStudentRepository.getByAssignmentId.mockResolvedValue([student]);
        mockSubmissionRepository.getAllForStudentInAssignment.mockResolvedValue(submissions);

        const result = await service.execute(input);
        expect(result).toEqual({ percentage: 50 });
    });

    it("should return 100% completion with multiple students all completing the learning path", async () => {
        const assignment: Assignment = {
            id: "assignment-1",
            learningPathId: "lp-1"
        } as any;
    
        const students: Student[] = [
            { id: "student-1" } as any,
            { id: "student-2" } as any
        ];
    
        const learningPath: LearningPath = {
            id: "lp-1",
            numNodes: 3,
            nodes: [
                { hruid: "node-1" },
                { hruid: "node-2" },
                { hruid: "node-3" }
            ]
        } as any;
    
        const submissionsForStudent1: Submission[] = [
            { learningObjectId: "node-1" } as any,
            { learningObjectId: "node-2" } as any,
            { learningObjectId: "node-3" } as any
        ];
    
        const submissionsForStudent2: Submission[] = [
            { learningObjectId: "node-1" } as any,
            { learningObjectId: "node-2" } as any,
            { learningObjectId: "node-3" } as any
        ];
    
        mockAssignmentRepository.getByClassId.mockResolvedValue([assignment]);
        mockLearningPathRepository.getLearningPath.mockResolvedValue(learningPath);
        mockStudentRepository.getByAssignmentId.mockResolvedValue(students);
    
        // Mock per student afhankelijk van hun id
        mockSubmissionRepository.getAllForStudentInAssignment.mockImplementation((studentId: string) => {
            if (studentId === "student-1") return Promise.resolve(submissionsForStudent1);
            if (studentId === "student-2") return Promise.resolve(submissionsForStudent2);
            return Promise.resolve([]);
        });
    
        const result = await service.execute({ idParent: "class-1" });
        expect(result).toEqual({ percentage: 100 });
    });
    
});
