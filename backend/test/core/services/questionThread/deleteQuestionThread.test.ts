import { DeleteQuestionThread, DeleteQuestionThreadInput } from '../../../../src/core/services/questionThread/deleteQuestionThread';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockQuestionThreadRepository = {
    delete: jest.fn(),
};

describe('DeleteQuestionThread', () => {
    let deleteQuestionThread: DeleteQuestionThread;
    let input: DeleteQuestionThreadInput;

    beforeEach(() => {
        deleteQuestionThread = new DeleteQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            id: "thread-123"
        };
    });

    test('Should delete a question thread and return an empty object', async () => {
        mockQuestionThreadRepository.delete.mockResolvedValue(undefined);

        const result = await deleteQuestionThread.execute(input);

        expect(result).toEqual({});
        expect(mockQuestionThreadRepository.delete).toHaveBeenCalledWith("thread-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        mockQuestionThreadRepository.delete.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteQuestionThread.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.delete).toHaveBeenCalledWith("thread-123");
    });
});
