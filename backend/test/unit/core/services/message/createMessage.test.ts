import { DatabaseError } from "../../../../../src/config/error";
import { Message } from "../../../../../src/core/entities/message";
import { CreateMessage, CreateMessageInput } from "../../../../../src/core/services/message/createMessage";

// Mock repository
const mockMessageRepository = {
    create: jest.fn(),
};

describe("CreateMessage", () => {
    let createMessage: CreateMessage;
    let input: CreateMessageInput;

    beforeEach(() => {
        createMessage = new CreateMessage(mockMessageRepository as any);
        jest.clearAllMocks();
        input = {
            senderId: "sender-123",
            createdAt: new Date(),
            threadId: "thread-456",
            content: "This is a test message",
        };
    });

    test("Should create a message and return it with an ID", async () => {
        const createdMessage = new Message(
            input.senderId,
            input.createdAt,
            input.threadId,
            input.content,
            "message-999",
        );

        mockMessageRepository.create.mockResolvedValue({ id: "message-999" });

        const result = await createMessage.execute("", input);

        expect(result).toEqual({ id: "message-999" });
        expect(mockMessageRepository.create).toHaveBeenCalledWith(expect.any(Message));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockMessageRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createMessage.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.create).toHaveBeenCalledWith(expect.any(Message));
    });
});
