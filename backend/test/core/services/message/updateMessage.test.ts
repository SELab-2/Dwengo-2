import { UpdateMessage, UpdateMessageParams } from '../../../../src/core/services/message/updateMessage';
import { Message } from '../../../../src/core/entities/message';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockMessageRepository = {
    getMessageById: jest.fn(),
    updateMessage: jest.fn(),
};

describe('UpdateMessage', () => {
    let updateMessage: UpdateMessage;

    beforeEach(() => {
        updateMessage = new UpdateMessage(mockMessageRepository as any);
        jest.clearAllMocks();
    });

    test('Should update a message successfully', async () => {
        const inputParams = new UpdateMessageParams("message-123", "Updated content");
        const existingMessage = new Message("sender-123", new Date(), "thread-456", "Old content", "message-123");

        mockMessageRepository.getMessageById.mockResolvedValue(existingMessage);
        mockMessageRepository.updateMessage.mockResolvedValue(undefined);

        const result = await updateMessage.execute(inputParams);

        expect(result).toEqual({ ...existingMessage.toObject(), content: "Updated content" });
        expect(mockMessageRepository.getMessageById).toHaveBeenCalledWith("message-123");
        expect(mockMessageRepository.updateMessage).toHaveBeenCalledWith(expect.any(Message));
    });

    test('Should throw a DatabaseError if update fails', async () => {
        const inputParams = new UpdateMessageParams("message-123", "Updated content");
        mockMessageRepository.getMessageById.mockRejectedValue(new DatabaseError('Retrieval failed'));

        await expect(updateMessage.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.getMessageById).toHaveBeenCalledWith("message-123");
    });
});
