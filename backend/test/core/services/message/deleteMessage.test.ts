import { DeleteMessage, DeleteMessageInput } from '../../../../src/core/services/message/deleteMessage';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockMessageRepository = {
    deleteMessageById: jest.fn(),
};

describe('DeleteMessage', () => {
    let deleteMessage: DeleteMessage;
    let input: DeleteMessageInput;

    beforeEach(() => {
        deleteMessage = new DeleteMessage(mockMessageRepository as any);
        jest.clearAllMocks();
        input = {
            id: "message-123"
        }
    });

    test('Should delete a message successfully', async () => {
        mockMessageRepository.deleteMessageById.mockResolvedValue(undefined);

        const result = await deleteMessage.execute(input);

        expect(result).toEqual({});
        expect(mockMessageRepository.deleteMessageById).toHaveBeenCalledWith("message-123");
    });

    test('Should throw a DatabaseError if deletion fails', async () => {
        mockMessageRepository.deleteMessageById.mockRejectedValue(new DatabaseError('Deletion failed'));

        await expect(deleteMessage.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.deleteMessageById).toHaveBeenCalledWith("message-123");
    });
});
