import { UpdateQuestionThread, UpdateQuestionThreadParams } from '../../../../src/core/services/questionThread/updateQuestionThread';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockQuestionThreadRepository = {
    updateQuestionThread: jest.fn(),
};

describe('UpdateQuestionThread', () => {
    let updateQuestionThread: UpdateQuestionThread;

    beforeEach(() => {
        updateQuestionThread = new UpdateQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
    });

    test('Should update a question thread and return the updated object', async () => {
        const inputParams = new UpdateQuestionThreadParams("thread-123", true, VisibilityType.PRIVATE);
        const updatedThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            true,
            VisibilityType.PRIVATE,
            [],
            "thread-123"
        );

        mockQuestionThreadRepository.updateQuestionThread.mockResolvedValue(updatedThread);

        const result = await updateQuestionThread.execute(inputParams);

        expect(result).toEqual(updatedThread.toObject());
        expect(mockQuestionThreadRepository.updateQuestionThread).toHaveBeenCalledWith("thread-123", {
            isClosed: true,
            visibility: VisibilityType.PRIVATE,
        });
    });

    test('Should throw a DatabaseError if update fails', async () => {
        const inputParams = new UpdateQuestionThreadParams("thread-123", true, VisibilityType.PUBLIC);

        mockQuestionThreadRepository.updateQuestionThread.mockRejectedValue(new DatabaseError('Update failed'));

        await expect(updateQuestionThread.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.updateQuestionThread).toHaveBeenCalledWith("thread-123", {
            isClosed: true,
            visibility: VisibilityType.PUBLIC,
        });
    });
});
