import { DeleteQuestionThread, DeleteQuestionThreadParams } from '../../../../src/core/services/question_thread/deleteQuestionThread';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockQuestionThreadRepository = {
    deleteQuestionThread: jest.fn(),
};

describe('DeleteQuestionThread', () => {
    let deleteQuestionThread: DeleteQuestionThread;

    beforeEach(() => {
        deleteQuestionThread = new DeleteQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks(); // Reset mocks voor elke test
    });

    test('Should delete a question thread and return an empty object', async () => {
        const inputParams = new DeleteQuestionThreadParams("thread-123");

        mockQuestionThreadRepository.deleteQuestionThread.mockResolvedValue(undefined);

        const result = await deleteQuestionThread.execute(inputParams);

        expect(result).toEqual({});
        expect(mockQuestionThreadRepository.deleteQuestionThread).toHaveBeenCalledWith("thread-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        const inputParams = new DeleteQuestionThreadParams("thread-123");

        mockQuestionThreadRepository.deleteQuestionThread.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteQuestionThread.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.deleteQuestionThread).toHaveBeenCalledWith("thread-123");
    });
});
