import { GetMessage, GetMessageParams } from '../../../../src/core/services/message/getMessage';
import { Message } from '../../../../src/core/entities/message';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockMessageRepository = {
    getById: jest.fn(),
};

describe('GetMessage', () => {
    let getMessage: GetMessage;

    beforeEach(() => {
        getMessage = new GetMessage(mockMessageRepository as any);
        jest.clearAllMocks();
    });

    test('Should retrieve a message successfully', async () => {
        const inputParams = new GetMessageParams("message-123");
        const retrievedMessage = new Message("sender-123", new Date(), "thread-456", "Hello World", "message-123");

        mockMessageRepository.getById.mockResolvedValue(retrievedMessage);

        const result = await getMessage.execute(inputParams);

        expect(result).toEqual(retrievedMessage.toObject());
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
    });

    test('Should throw a DatabaseError if retrieval fails', async () => {
        const inputParams = new GetMessageParams("message-123");
        mockMessageRepository.getById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(getMessage.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
    });
});
