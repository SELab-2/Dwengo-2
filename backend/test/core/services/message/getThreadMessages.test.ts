import { GetThreadMessages, GetThreadMessagesInput } from '../../../../src/core/services/message/getThreadMessages';
import { Message } from '../../../../src/core/entities/message';
import { DatabaseError } from '../../../../src/config/error';

// Mock repositories
const mockQuestionThreadRepository = {
    getQuestionThreadById: jest.fn(),
};


describe('GetThreadMessages', () => {
    let getThreadMessages: GetThreadMessages;
    let input: GetThreadMessagesInput;

    beforeEach(() => {
        getThreadMessages = new GetThreadMessages(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            threadId: "thread-456"
        }
    });

    test('Should retrieve messages for a thread successfully', async () => {
        const threadData = { messageIds: ["message-123", "message-456"] };
        const retrievedMessages = [
            new Message("sender-123", new Date(), "thread-456", "Hello", "message-123"),
            new Message("sender-456", new Date(), "thread-456", "Hi there", "message-456"),
        ];

        mockQuestionThreadRepository.getQuestionThreadById.mockResolvedValue(threadData);

        const result = await getThreadMessages.execute(input);

        expect(result).toEqual({ messages: retrievedMessages.map(msg => msg.id) });
        expect(mockQuestionThreadRepository.getQuestionThreadById).toHaveBeenCalledWith("thread-456");
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        mockQuestionThreadRepository.getQuestionThreadById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getThreadMessages.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getQuestionThreadById).toHaveBeenCalledWith("thread-456");
    });
});
