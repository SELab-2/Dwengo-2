import { GetSubmission, GetSubmissionParams } from "../../../../src/core/services/submission/getSubmission";
import { Submission, StatusType } from "../../../../src/core/entities/submission";
import { DatabaseError } from "../../../../src/config/error";

// Mock repository
const mockSubmissionRepository = {
    getById: jest.fn(),
};

describe('GetSubmission', () => {
    let getSubmission: GetSubmission;

    beforeEach(() => {
        getSubmission = new GetSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve a submission by ID and return it as an object', async () => {
        const inputParams = new GetSubmissionParams("submission-123");
        const submission = new Submission(
            "student-456",
            "assignment-789",
            "learningObj-101",
            new Date("2025-03-11T12:00:00Z"),
            Buffer.from("submission data"),
            StatusType.NOT_ACCEPTED,
            "submission-123"
        );

        mockSubmissionRepository.getById.mockResolvedValue(submission);

        const result = await getSubmission.execute(inputParams);

        expect(result).toEqual(submission.toObject());
        expect(mockSubmissionRepository.getById).toHaveBeenCalledWith("submission-123");
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const inputParams = new GetSubmissionParams("submission-123");

        mockSubmissionRepository.getById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getSubmission.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.getById).toHaveBeenCalledWith("submission-123");
    });
});
