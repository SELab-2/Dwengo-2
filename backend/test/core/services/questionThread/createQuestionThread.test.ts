import { DatabaseError } from '../../../../src/config/error';
import { CreateQuestionThread, CreateQuestionThreadInput } from '../../../../src/core/services/questionThread/createQuestionThread';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';

// Mock repository
const mockQuestionThreadRepository = {
    createQuestionThread: jest.fn(),
};

describe('CreateQuestionThread', () => {
    let createQuestionThread: CreateQuestionThread;
    let input: CreateQuestionThreadInput;

    beforeEach(() => {
        createQuestionThread = new CreateQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            creatorId: "creator-123",
            assignmentId: "assignment-456",
            learningObjectId: "learningObj-789",
            isClosed: false,
            visibility: VisibilityType.PUBLIC,
            messageIds: ["message-1", "message-2"]
        };
    });

    test('Should create a question thread and return it as an object', async () => {
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

        const result = await createQuestionThread.execute(input);

        expect(result).toEqual(createdQuestionThread.toObject());
        expect(mockQuestionThreadRepository.createQuestionThread).toHaveBeenCalledWith(expect.any(QuestionThread));
    });

    test('Should throw a DatabaseError if creation fails', async () => {
        mockQuestionThreadRepository.createQuestionThread.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createQuestionThread.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.createQuestionThread).toHaveBeenCalledWith(expect.any(QuestionThread));
    });
});
