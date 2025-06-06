import { DatabaseError } from "../../../../../src/config/error";
import { Message } from "../../../../../src/core/entities/message";
import { GetMessage, GetMessageInput } from "../../../../../src/core/services/message/getMessage";

// Mock repository
const mockMessageRepository = {
    getById: jest.fn(),
};

describe("GetMessage", () => {
    let getMessage: GetMessage;
    let input: GetMessageInput;

    beforeEach(() => {
        getMessage = new GetMessage(mockMessageRepository as any);
        jest.clearAllMocks();
        input = {
            id: "message-123",
        };
    });

    test("Should retrieve a message successfully", async () => {
        const retrievedMessage = new Message("sender-123", new Date(), "thread-456", "Hello World", "message-123");

        mockMessageRepository.getById.mockResolvedValue(retrievedMessage);

        const result = await getMessage.execute("", input);

        expect(result).toEqual(retrievedMessage.toObject());
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
    });

    test("Should throw a DatabaseError if retrieval fails", async () => {
        mockMessageRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(getMessage.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
    });
});
