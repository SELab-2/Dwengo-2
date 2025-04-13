import { DatabaseError } from "../../../../../src/config/error";
import { QuestionThread, VisibilityType } from "../../../../../src/core/entities/questionThread";
import {
    UpdateQuestionThread,
    UpdateQuestionThreadInput,
} from "../../../../../src/core/services/questionThread/updateQuestionThread";

// Mock repository
const mockQuestionThreadRepository = {
    update: jest.fn(),
};

describe("UpdateQuestionThread", () => {
    let updateQuestionThread: UpdateQuestionThread;
    let input: UpdateQuestionThreadInput;

    beforeEach(() => {
        updateQuestionThread = new UpdateQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();
        input = {
            id: "thread-123",
            isClosed: true,
            visibility: VisibilityType.PRIVATE,
        };
    });

    test("Should update a question thread and return the updated object", async () => {
        const updatedThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            true,
            VisibilityType.PRIVATE,
            [],
            "thread-123",
        );

        mockQuestionThreadRepository.update.mockResolvedValue(updatedThread);

        const result = await updateQuestionThread.execute(input);

        expect(result).toEqual({});
        expect(mockQuestionThreadRepository.update).toHaveBeenCalledWith("thread-123", {
            isClosed: true,
            visibility: VisibilityType.PRIVATE,
        });
    });

    test("Should throw a DatabaseError if update fails", async () => {
        mockQuestionThreadRepository.update.mockRejectedValue(new DatabaseError("Update failed"));

        await expect(updateQuestionThread.execute(input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.update).toHaveBeenCalledWith("thread-123", {
            isClosed: true,
            visibility: VisibilityType.PRIVATE,
        });
    });
});
