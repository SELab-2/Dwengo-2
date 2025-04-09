import { DatabaseError } from "../../../../src/config/error";
import { DeleteSubmission, DeleteSubmissionInput } from "../../../../src/core/services/submission/deleteSubmission";

// Mock repository
const mockSubmissionRepository = {
    delete: jest.fn(),
};

describe("DeleteSubmission", () => {
    let deleteSubmission: DeleteSubmission;
    let input: DeleteSubmissionInput;

    beforeEach(() => {
        deleteSubmission = new DeleteSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
        input = {
            id: "submission-123",
        };
    });

    test("Should delete a submission successfully", async () => {
        mockSubmissionRepository.delete.mockResolvedValue(undefined);

        const result = await deleteSubmission.execute(input);

        expect(result).toEqual({});
        expect(mockSubmissionRepository.delete).toHaveBeenCalledWith("submission-123");
    });

    test("Should throw a DatabaseError if deletion fails", async () => {
        mockSubmissionRepository.delete.mockRejectedValue(new DatabaseError("Deletion failed"));

        await expect(deleteSubmission.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.delete).toHaveBeenCalledWith("submission-123");
    });
});
