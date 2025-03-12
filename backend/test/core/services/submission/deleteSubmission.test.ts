import { DeleteSubmission, DeleteSubmissionParams } from "../../../../src/core/services/submission/deleteSubmission";
import { DatabaseError } from "../../../../src/config/error";

// Mock repository
const mockSubmissionRepository = {
    delete: jest.fn(),
};

describe('DeleteSubmission', () => {
    let deleteSubmission: DeleteSubmission;

    beforeEach(() => {
        deleteSubmission = new DeleteSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
    });

    test('Should delete a submission successfully', async () => {
        const inputParams = new DeleteSubmissionParams("submission-123");

        mockSubmissionRepository.delete.mockResolvedValue(undefined);

        const result = await deleteSubmission.execute(inputParams);

        expect(result).toEqual({});
        expect(mockSubmissionRepository.delete).toHaveBeenCalledWith("submission-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        const inputParams = new DeleteSubmissionParams("submission-123");

        mockSubmissionRepository.delete.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteSubmission.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.delete).toHaveBeenCalledWith("submission-123");
    });
});
