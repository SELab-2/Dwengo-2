import { DeleteMessage, DeleteMessageParams } from '../../../../src/core/services/message/deleteMessage';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockMessageRepository = {
    deleteMessageById: jest.fn(),
};

describe('DeleteMessage', () => {
    let deleteMessage: DeleteMessage;

    beforeEach(() => {
        deleteMessage = new DeleteMessage(mockMessageRepository as any);
        jest.clearAllMocks();
    });

    test('Should delete a message successfully', async () => {
        const inputParams = new DeleteMessageParams("message-123");
        mockMessageRepository.deleteMessageById.mockResolvedValue(undefined);

        const result = await deleteMessage.execute(inputParams);

        expect(result).toEqual({});
        expect(mockMessageRepository.deleteMessageById).toHaveBeenCalledWith("message-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        const inputParams = new DeleteMessageParams("message-123");
        mockMessageRepository.deleteMessageById.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteMessage.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.deleteMessageById).toHaveBeenCalledWith("message-123");
    });
});
