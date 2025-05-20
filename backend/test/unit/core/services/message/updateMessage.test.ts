import { DatabaseError } from "../../../../../src/config/error";
import { Message } from "../../../../../src/core/entities/message";
import { UpdateMessage, UpdateMessageInput } from "../../../../../src/core/services/message/updateMessage";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockMessageRepository = {
    getById: jest.fn(),
    update: jest.fn(),
};

const mockUserRepository = {
    getById: jest.fn(),
} as unknown as jest.Mocked<IUserRepository>;

describe("UpdateMessage", () => {
    let updateMessage: UpdateMessage;
    let input: UpdateMessageInput;

    beforeEach(() => {
        updateMessage = new UpdateMessage(mockMessageRepository as any, mockUserRepository);
        jest.clearAllMocks();
        input = {
            id: "message-123",
            content: "Updated content",
        };
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should update a message successfully", async () => {
        const existingMessage = new Message("sender-123", new Date(), "thread-456", "Old content", "message-123");

        mockMessageRepository.getById.mockResolvedValue(existingMessage);
        mockMessageRepository.update.mockResolvedValue(undefined);

        const result = await updateMessage.execute("", input);

        expect(result).toEqual({});
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
        expect(mockMessageRepository.update).toHaveBeenCalledWith(expect.any(Message));
    });

    test("Should throw a DatabaseError if update fails", async () => {
        mockMessageRepository.getById.mockRejectedValue(new DatabaseError("Retrieval failed"));

        await expect(updateMessage.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockMessageRepository.getById).toHaveBeenCalledWith("message-123");
    });
});
