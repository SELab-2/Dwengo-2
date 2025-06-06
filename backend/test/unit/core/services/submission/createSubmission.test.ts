import { z } from "zod";
import { DatabaseError } from "../../../../../src/config/error";
import { Submission, StatusType } from "../../../../../src/core/entities/submission";
import { CreateSubmission, CreateSubmissionInput } from "../../../../../src/core/services/submission/createSubmission";

// Mock repository
const mockSubmissionRepository = {
    create: jest.fn(),
};

describe("CreateSubmission", () => {
    let createSubmission: CreateSubmission;
    let input: CreateSubmissionInput;

    beforeEach(() => {
        createSubmission = new CreateSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
        input = {
            studentId: "student-123",
            assignmentId: "assignment-456",
            taskId: "task-789",
            learningObjectId: "learningObject-202",
            time: new Date(),
            contents: "submission contents",
            status: StatusType.NOT_ACCEPTED,
        };
    });

    test("Should create a submission and return it with an ID", async () => {
        const createdSubmission = new Submission(
            "student-123",
            "assignment-456",
            "task-789",
            "learningObject-202",
            input.time,
            Buffer.from(input.contents),
            input.status,
            "submission-999",
        );

        mockSubmissionRepository.create.mockResolvedValue("submission-999");

        const result = await createSubmission.execute("", input);

        expect(result).toEqual({ id: "submission-999" });
        expect(mockSubmissionRepository.create).toHaveBeenCalledWith(expect.any(Submission));
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockSubmissionRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(createSubmission.execute("", input)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.create).toHaveBeenCalledWith(expect.any(Submission));
    });
});
