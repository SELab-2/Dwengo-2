import { DatabaseError } from '../../../../src/config/error';
import { GetAssignmentQuestionThreads, GetAssignmentQuestoinThreadsParams } from '../../../../src/core/services/question_thread/getAssignmentQuestionThreads';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';

// Mock repository
const mockQuestionThreadRepository = {
    getQuestionThreadsByAssignmentId: jest.fn(),
};

describe('GetAssignmentQuestionThreads', () => {
    let getAssignmentQuestionThreads: GetAssignmentQuestionThreads;

    beforeEach(() => {
        getAssignmentQuestionThreads = new GetAssignmentQuestionThreads(mockQuestionThreadRepository as any);
        jest.clearAllMocks(); // Reset mocks voor elke test
    });

    test('Should retrieve question threads for an assignment and return them as an object list', async () => {
        const inputParams = new GetAssignmentQuestoinThreadsParams("assignment-123");

        const questionThreads = [
            new QuestionThread("creator-1", "assignment-123", "learningObj-456", false, VisibilityType.PUBLIC, ["msg-1", "msg-2"], "thread-1"),
            new QuestionThread("creator-2", "assignment-123", "learningObj-789", true, VisibilityType.PRIVATE, ["msg-3"], "thread-2")
        ];

        mockQuestionThreadRepository.getQuestionThreadsByAssignmentId.mockResolvedValue(questionThreads);

        const result = await getAssignmentQuestionThreads.execute(inputParams);

        expect(result).toEqual({
            threads: questionThreads.map(qt => qt.toObject())
        });

        expect(mockQuestionThreadRepository.getQuestionThreadsByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });

    test('Should return an empty list if no threads are found', async () => {
        const inputParams = new GetAssignmentQuestoinThreadsParams("assignment-123");

        mockQuestionThreadRepository.getQuestionThreadsByAssignmentId.mockResolvedValue([]);

        const result = await getAssignmentQuestionThreads.execute(inputParams);

        expect(result).toEqual({ threads: [] });

        expect(mockQuestionThreadRepository.getQuestionThreadsByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });

    test('Should throw a DatabaseError if database retrieval fails', async () => {
        const inputParams = new GetAssignmentQuestoinThreadsParams("assignment-123");

        mockQuestionThreadRepository.getQuestionThreadsByAssignmentId.mockRejectedValue(new DatabaseError('Database error'));

        await expect(getAssignmentQuestionThreads.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getQuestionThreadsByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });
});
