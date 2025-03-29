import { DatabaseError, EntityNotFoundError } from '../../../../src/config/error';
import { GetQuestionThread, GetQuestionThreadInput } from '../../../../src/core/services/questionThread/getQuestionThread';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';

// Mock repository
const mockQuestionThreadRepository = {
    getQuestionThreadById: jest.fn(),
};

describe('GetQuestionThread', () => {
    let getQuestionThread: GetQuestionThread;
    let input: GetQuestionThreadInput;

    beforeEach(() => {
        getQuestionThread = new GetQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            id: "thread-999"
        }
    });

    test('Should retrieve a question thread and return it as an object', async () => {
        const existingQuestionThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"],
            "thread-999"
        );

        mockQuestionThreadRepository.getQuestionThreadById.mockResolvedValue(existingQuestionThread);

        const result = await getQuestionThread.execute(input);

        expect(result).toEqual(existingQuestionThread.toObject());
        expect(mockQuestionThreadRepository.getQuestionThreadById).toHaveBeenCalledWith("thread-999");
    });

    test('Should throw an EntityNotFoundError if the question thread does not exist', async () => {
        mockQuestionThreadRepository.getQuestionThreadById.mockRejectedValue(new EntityNotFoundError('Thread not found'));

        await expect(getQuestionThread.execute(input)).rejects.toThrow(EntityNotFoundError);
        expect(mockQuestionThreadRepository.getQuestionThreadById).toHaveBeenCalledWith("thread-999");
    });

    test('Should throw a DatabaseError if database retrieval fails', async () => {
        mockQuestionThreadRepository.getQuestionThreadById.mockRejectedValue(new DatabaseError('Database error'));

        await expect(getQuestionThread.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getQuestionThreadById).toHaveBeenCalledWith("thread-999");
    });
});
