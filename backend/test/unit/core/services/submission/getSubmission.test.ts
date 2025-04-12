import { DatabaseError } from "../../../../../src/config/error";
import { Submission, StatusType } from "../../../../../src/core/entities/submission";
import { GetSubmission, GetSubmissionInput } from "../../../../../src/core/services/submission/getSubmission";

// Mock repository
const mockSubmissionRepository = {
    getById: jest.fn(),
};

describe("GetSubmission", () => {
    let getSubmission: GetSubmission;
    let input: GetSubmissionInput;

    beforeEach(() => {
        getSubmission = new GetSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
        input = {
            id: "submission-123",
        };
    });

    test("Should retrieve a submission by ID and return it as an object", async () => {
        const submission = new Submission(
            "student-456",
            "assignment-789",
            "learningObj-101",
            new Date("2025-03-11T12:00:00Z"),
            Buffer.from("submission data"),
            StatusType.NOT_ACCEPTED,
            "submission-123",
        );

        mockSubmissionRepository.getById.mockResolvedValue(submission);

        const result = await getSubmission.execute(input);

        expect(result).toEqual(submission.toObject());
        expect(mockSubmissionRepository.getById).toHaveBeenCalledWith("submission-123");
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        mockSubmissionRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getSubmission.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.getById).toHaveBeenCalledWith("submission-123");
    });
});
