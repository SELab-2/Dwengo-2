import { CreateMessage, CreateMessageParams } from '../../../../src/core/services/message/createMessage';
import { Message } from '../../../../src/core/entities/message';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockMessageRepository = {
    createMessage: jest.fn(),
};

describe('CreateMessage', () => {
    let createMessage: CreateMessage;

    beforeEach(() => {
        createMessage = new CreateMessage(mockMessageRepository as any);
        jest.clearAllMocks();
    });

    test('Should create a message and return it with an ID', async () => {
        const inputParams = new CreateMessageParams(
            "sender-123",
            new Date(),
            "thread-456",
            "This is a test message"
        );

        const createdMessage = new Message(
            inputParams.senderId,
            inputParams.createdAt,
            inputParams.threadId,
            inputParams.content,
            "message-999"
        );

        mockMessageRepository.createMessage.mockResolvedValue({id: "message-999"});

        const result = await createMessage.execute(inputParams);

        expect(result).toEqual({ id: "message-999" });
        expect(mockMessageRepository.createMessage).toHaveBeenCalledWith(expect.any(Message));

    });

    test('Should throw a DatabaseError if creation fails', async () => {
        const inputParams = new CreateMessageParams(
            "sender-123",
            new Date(),
            "thread-456",
            "This is a test message"
        );

        mockMessageRepository.createMessage.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createMessage.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.createMessage).toHaveBeenCalledWith(expect.any(Message));
    });
});
