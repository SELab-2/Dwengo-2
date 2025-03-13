import { DatabaseError } from '../../../../src/config/error';
import { CreateQuestionThread, CreateQuestionThreadParams } from '../../../../src/core/services/questionThread/createQuestionThread';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';

// Mock repository
const mockQuestionThreadRepository = {
    createQuestionThread: jest.fn(),
};

describe('CreateQuestionThread', () => {
    let createQuestionThread: CreateQuestionThread;

    beforeEach(() => {
        createQuestionThread = new CreateQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
    });

    test('Should create a question thread and return it as an object', async () => {
        const inputParams = new CreateQuestionThreadParams(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"]
        );

        const createdQuestionThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"],
            "thread-999"
        );

        mockQuestionThreadRepository.createQuestionThread.mockResolvedValue(createdQuestionThread);

        const result = await createQuestionThread.execute(inputParams);

        expect(result).toEqual(createdQuestionThread.toObject());
        expect(mockQuestionThreadRepository.createQuestionThread).toHaveBeenCalledWith(expect.any(QuestionThread));
    });

    test('Should throw a DatabaseError if creation fails', async () => {
        const inputParams = new CreateQuestionThreadParams(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"]
        );

        mockQuestionThreadRepository.createQuestionThread.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createQuestionThread.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.createQuestionThread).toHaveBeenCalledWith(expect.any(QuestionThread));
    });
});
