import { DatabaseError, EntityNotFoundError } from "../../../../src/config/error";
import { QuestionThread, VisibilityType } from "../../../../src/core/entities/questionThread";
import {
    GetQuestionThread,
    GetQuestionThreadInput,
} from "../../../../src/core/services/questionThread/getQuestionThread";

// Mock repository
const mockQuestionThreadRepository = {
    getById: jest.fn(),
};

describe("GetQuestionThread", () => {
    let getQuestionThread: GetQuestionThread;
    let input: GetQuestionThreadInput;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getQuestionThread = new GetQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            id: "thread-999",
        };
    });

    test("Should retrieve a question thread and return it as an object", async () => {
        const existingQuestionThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"],
            "thread-999",
        );

        mockQuestionThreadRepository.getById.mockResolvedValue(existingQuestionThread);

        const result = await getQuestionThread.execute(input);

        expect(result).toEqual(existingQuestionThread.toObject());
        expect(mockQuestionThreadRepository.getById).toHaveBeenCalledWith("thread-999");
    });

    test("Should throw an EntityNotFoundError if the question thread does not exist", async () => {
        mockQuestionThreadRepository.getById.mockRejectedValue(new EntityNotFoundError("Thread not found"));

        await expect(getQuestionThread.execute(input)).rejects.toThrow(EntityNotFoundError);
        expect(mockQuestionThreadRepository.getById).toHaveBeenCalledWith("thread-999");
    });

    test("Should throw a DatabaseError if database retrieval fails", async () => {
        mockQuestionThreadRepository.getById.mockRejectedValue(new DatabaseError("Database error"));

        await expect(getQuestionThread.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.getById).toHaveBeenCalledWith("thread-999");
    });
});
