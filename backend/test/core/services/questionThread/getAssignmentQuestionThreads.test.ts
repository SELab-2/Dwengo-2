import { DatabaseError } from '../../../../src/config/error';
import { GetAssignmentQuestionThreads, GetAssignmentQuestionThreadsInput } from '../../../../src/core/services/questionThread/getAssignmentQuestionThreads';
import { QuestionThread, VisibilityType } from '../../../../src/core/entities/questionThread';

// Mock repository
const mockQuestionThreadRepository = {
    getByAssignmentId: jest.fn(),
};

describe('GetAssignmentQuestionThreads', () => {
    let getAssignmentQuestionThreads: GetAssignmentQuestionThreads;
    let input: GetAssignmentQuestionThreadsInput;

    beforeEach(() => {
        getAssignmentQuestionThreads = new GetAssignmentQuestionThreads(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            idParent: "assignment-123"
        };
    });

    test('Should retrieve question threads for an assignment and return them as an object list', async () => {
        const questionThreads = [
            new QuestionThread("creator-1", "assignment-123", "learningObj-456", false, VisibilityType.PUBLIC, ["msg-1", "msg-2"], "thread-1"),
            new QuestionThread("creator-2", "assignment-123", "learningObj-789", true, VisibilityType.PRIVATE, ["msg-3"], "thread-2")
        ];

        mockQuestionThreadRepository.getByAssignmentId.mockResolvedValue(questionThreads);

        const result = await getAssignmentQuestionThreads.execute(input);

        expect(result).toEqual({
            threads: questionThreads.map(qt => qt.id)
        });

        expect(mockQuestionThreadRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });

    test('Should return an empty list if no threads are found', async () => {
        mockQuestionThreadRepository.getByAssignmentId.mockResolvedValue([]);

        const result = await getAssignmentQuestionThreads.execute(input);

        expect(result).toEqual({ threads: [] });

        expect(mockQuestionThreadRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });

    test('Should throw a DatabaseError if database retrieval fails', async () => {
        mockQuestionThreadRepository.getByAssignmentId.mockRejectedValue(new DatabaseError('Database error'));

        await expect(getAssignmentQuestionThreads.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-123");
    });
});
