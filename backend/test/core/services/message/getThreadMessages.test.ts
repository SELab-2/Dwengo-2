import { GetThreadMessages, GetThreadMessagesParams } from '../../../../src/core/services/message/getThreadMessages';
import { Message } from '../../../../src/core/entities/message';
import { DatabaseError } from '../../../../src/config/error';

// Mock repositories
const mockQuestionThreadRepository = {
    getById: jest.fn(),
};

const mockMessageRepository = {
    getById: jest.fn(),
};

describe('GetThreadMessages', () => {
    let getThreadMessages: GetThreadMessages;

    beforeEach(() => {
        getThreadMessages = new GetThreadMessages(mockQuestionThreadRepository as any, mockMessageRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve messages for a thread successfully', async () => {
        const inputParams = new GetThreadMessagesParams("thread-456");
        const threadData = { messageIds: ["message-123", "message-456"] };
        const retrievedMessages = [
            new Message("sender-123", new Date(), "thread-456", "Hello", "message-123"),
            new Message("sender-456", new Date(), "thread-456", "Hi there", "message-456"),
        ];

        mockQuestionThreadRepository.getById.mockResolvedValue(threadData);
        mockMessageRepository.getById.mockImplementation((id) =>
            Promise.resolve(retrievedMessages.find(msg => msg.id === id))
        );

        const result = await getThreadMessages.execute(inputParams);

        expect(result).toEqual({ messages: retrievedMessages.map(msg => msg.toObject()) });
        expect(mockQuestionThreadRepository.getById).toHaveBeenCalledWith("thread-456");
        expect(mockMessageRepository.getById).toHaveBeenCalledTimes(2);
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const inputParams = new GetThreadMessagesParams("thread-456");
        mockQuestionThreadRepository.getById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getThreadMessages.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getById).toHaveBeenCalledWith("thread-456");
    });
});
