
import { Assignment } from "../../../../../src/core/entities/assignment";
import { StatusType, Submission } from "../../../../../src/core/entities/submission";
import { GetClassScore } from "../../../../../src/core/services/progress/getClassScore";

// Mocks
const mockSubmissionRepository = {
    getAllForAssignment: jest.fn(),
};

const mockAssignmentRepository = {
    getByClassId: jest.fn(),
};

// Service instance
const getClassScoreService = new GetClassScore(
    mockSubmissionRepository as any,
    mockAssignmentRepository as any,
);

const input = {
    idParent: "class-123",
};

function makeSubmission(status: StatusType): Submission {
    return new Submission(
        "a1",
        "s1",
        "t1",
        "learningObject",
        new Date(),
        Buffer.from(""),
        status,
        "sub-id",

    )
}

describe("GetClassScore", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should calculate 100% score if all submissions are accepted", async () => {
        const assignments: Assignment[] = [
            { id: "a1", name: "Assignment 1", classId: "class-123" } as Assignment,
        ];

        const submissions: Submission[] = [
            makeSubmission(StatusType.ACCEPTED),
            makeSubmission(StatusType.ACCEPTED),
        ];

        mockAssignmentRepository.getByClassId.mockResolvedValue(assignments);
        mockSubmissionRepository.getAllForAssignment.mockResolvedValue(submissions);

        const result = await getClassScoreService.execute("", input);

        expect(result).toEqual({ score: 100 });
    });

    it("should calculate 50% score if half the submissions are accepted", async () => {
        const assignments: Assignment[] = [
            { id: "a1", name: "Assignment 1", classId: "class-123" } as Assignment,
        ];

        const submissions: Submission[] = [
            makeSubmission(StatusType.ACCEPTED),
            makeSubmission(StatusType.REJECTED),
        ];

        mockAssignmentRepository.getByClassId.mockResolvedValue(assignments);
        mockSubmissionRepository.getAllForAssignment.mockResolvedValue(submissions);

        const result = await getClassScoreService.execute("", input);

        expect(result).toEqual({ score: 50 });
    });

    it("should return 0% if there are no accepted submissions", async () => {
        const assignments: Assignment[] = [
            { id: "a1", name: "Assignment 1", classId: "class-123" } as Assignment,
        ];

        const submissions: Submission[] = [
            makeSubmission(StatusType.REJECTED),
            makeSubmission(StatusType.REJECTED),
        ];

        mockAssignmentRepository.getByClassId.mockResolvedValue(assignments);
        mockSubmissionRepository.getAllForAssignment.mockResolvedValue(submissions);

        const result = await getClassScoreService.execute("", input);

        expect(result).toEqual({ score: 0 });
    });

    it("should handle empty assignments list (0/0)", async () => {
        mockAssignmentRepository.getByClassId.mockResolvedValue([]);

        const result = await getClassScoreService.execute("", input);

        expect(result).toEqual({ score: null });
    });
});
