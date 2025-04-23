import { DatabaseError } from "../../../../../src/config/error";
import { DeleteMessage, DeleteMessageInput } from "../../../../../src/core/services/message/deleteMessage";

// Mock repository
const mockMessageRepository = {
    delete: jest.fn(),
};

describe("DeleteMessage", () => {
    let deleteMessage: DeleteMessage;
    let input: DeleteMessageInput;

    beforeEach(() => {
        deleteMessage = new DeleteMessage(mockMessageRepository as any);
        jest.clearAllMocks();
        input = {
            id: "message-123",
        };
    });

    test("Should delete a message successfully", async () => {
        mockMessageRepository.delete.mockResolvedValue(undefined);

        const result = await deleteMessage.execute(input);

        expect(result).toEqual({});
        expect(mockMessageRepository.delete).toHaveBeenCalledWith("message-123");
    });

    test("Should throw a DatabaseError if deletion fails", async () => {
        mockMessageRepository.delete.mockRejectedValue(new DatabaseError("Deletion failed"));

        await expect(deleteMessage.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.delete).toHaveBeenCalledWith("message-123");
    });
});
