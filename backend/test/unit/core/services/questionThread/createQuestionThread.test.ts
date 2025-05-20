import { DatabaseError } from "../../../../../src/config/error";
import { QuestionThread, VisibilityType } from "../../../../../src/core/entities/questionThread";
import {
    CreateQuestionThread,
    CreateQuestionThreadInput,
} from "../../../../../src/core/services/questionThread/createQuestionThread";

// Mock repository
const mockQuestionThreadRepository = {
    create: jest.fn(),
};

describe("CreateQuestionThread", () => {
    let createQuestionThread: CreateQuestionThread;
    let input: CreateQuestionThreadInput;

    beforeEach(() => {
        createQuestionThread = new CreateQuestionThread(mockQuestionThreadRepository as any);
        jest.clearAllMocks();

        input = {
            creatorId: "creator-123",
            assignmentId: "assignment-456",
            learningObjectId: "learningObj-789",
            isClosed: false,
            visibility: VisibilityType.PUBLIC,
        };
    });

    test("Should create a question thread and return it as an object", async () => {
        const createdQuestionThread = new QuestionThread(
            "creator-123",
            "assignment-456",
            "learningObj-789",
            false,
            VisibilityType.PUBLIC,
            ["message-1", "message-2"],
            "thread-999",
        );

        mockQuestionThreadRepository.create.mockResolvedValue(createdQuestionThread);

        const result = await createQuestionThread.execute("", input);

        expect(result).toEqual({ id: createdQuestionThread.id });
        expect(mockQuestionThreadRepository.create).toHaveBeenCalledWith(expect.any(QuestionThread));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockQuestionThreadRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createQuestionThread.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockQuestionThreadRepository.create).toHaveBeenCalledWith(expect.any(QuestionThread));
    });
});
