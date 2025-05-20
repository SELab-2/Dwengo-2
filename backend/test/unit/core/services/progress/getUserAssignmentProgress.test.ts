import { Assignment } from "../../../../../src/core/entities/assignment";
import { PathLearningObject } from "../../../../../src/core/entities/learningObject";
import { LearningPath } from "../../../../../src/core/entities/learningPath";
import { Submission } from "../../../../../src/core/entities/submission";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";
import { GetUserAssignmentProgress } from "../../../../../src/core/services/progress";

// Mock repositories
const assignmentRepository = { getById: jest.fn() };
const learningPathRepository = { getLearningPath: jest.fn() };
const submissionRepository = { getAllForStudentInAssignment: jest.fn() };
const mockUserRepository = {
    getById: jest.fn(),
    getByAssignmentId: jest.fn()
} as unknown as jest.Mocked<IUserRepository>;

class TestableGetUserAssignmentProgress extends GetUserAssignmentProgress {
    constructor() {
        super(submissionRepository as any, assignmentRepository as any, learningPathRepository as any, mockUserRepository);
    }
}

describe("GetUserAssignmentProgress", () => {
    const assignment = { id: "a1", learningPathId: "lp1" } as Assignment;
    const learningPath: Partial<LearningPath> = {
        id: "lp1",
        numNodes: 3,
        nodes: [{ hruid: "n1" }, { hruid: "n2" }, { hruid: "n3" }] as unknown as PathLearningObject[],
    };

    beforeEach(() => {
        assignmentRepository.getById.mockResolvedValue(assignment);
        learningPathRepository.getLearningPath.mockResolvedValue(learningPath);
    });

    it("returns correct progress for latest submission on furthest node", async () => {
        const submissions: Partial<Submission>[] = [
            {
                id: "s1",
                studentId: "u1",
                assignmentId: "a1",
                learningObjectId: "n1",
                time: new Date("2024-01-01"),
            },
            {
                id: "s2",
                studentId: "u1",
                assignmentId: "a1",
                learningObjectId: "n2",
                time: new Date("2024-01-02"),
            },
            {
                id: "s3",
                studentId: "u1",
                assignmentId: "a1",
                learningObjectId: "n2",
                time: new Date("2024-01-03"),
            },
        ];

        submissionRepository.getAllForStudentInAssignment.mockResolvedValue(submissions);

        const service = new TestableGetUserAssignmentProgress();
        const result = await service.execute("", { userId: "u1", assignmentId: "a1" });

        expect(result).toEqual({
            id: "s3",
            studentId: "u1",
            assignmentId: "a1",
            learningObjectId: "n2",
            step: 2,
            maxStep: 3,
            time: new Date("2024-01-03"),
        });
    });

    it("returns null values when there are no submissions", async () => {
        submissionRepository.getAllForStudentInAssignment.mockResolvedValue([]);

        const service = new TestableGetUserAssignmentProgress();
        const result = await service.execute("", { userId: "u1", assignmentId: "a1" });

        expect(result).toEqual({
            id: null,
            studentId: "u1",
            assignmentId: "a1",
            learningObjectId: null,
            step: 0,
            maxStep: 3,
            time: null,
        });
    });

    it("picks latest submission if two have same timestamp on same node", async () => {
        const sameTime = new Date("2024-01-05");

        const submissions: Partial<Submission>[] = [
            {
                id: "s1",
                studentId: "u1",
                assignmentId: "a1",
                learningObjectId: "n3",
                time: sameTime,
            },
            {
                id: "s2",
                studentId: "u1",
                assignmentId: "a1",
                learningObjectId: "n3",
                time: sameTime,
            },
        ];

        submissionRepository.getAllForStudentInAssignment.mockResolvedValue(submissions);

        const service = new TestableGetUserAssignmentProgress();
        const result = await service.execute("", { userId: "u1", assignmentId: "a1" }) as { id: string };

        // s1 or s2 could be picked since timestamps are same
        expect(result).toMatchObject({
            studentId: "u1",
            assignmentId: "a1",
            learningObjectId: "n3",
            step: 3,
            maxStep: 3,
            time: sameTime,
        });
        expect(["s1", "s2"]).toContain(result.id);
    });
});
