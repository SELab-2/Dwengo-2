import { CreateSubmission, CreateSubmissionParams } from '../../../../src/core/services/submission/createSubmission';
import { Submission, StatusType } from '../../../../src/core/entities/submission';
import { DatabaseError } from '../../../../src/config/error';

// Mock repository
const mockSubmissionRepository = {
    create: jest.fn(),
};

describe('CreateSubmission', () => {
    let createSubmission: CreateSubmission;

    beforeEach(() => {
        createSubmission = new CreateSubmission(mockSubmissionRepository as any);
        jest.clearAllMocks();
    });

    test('Should create a submission and return it with an ID', async () => {
        const inputParams = new CreateSubmissionParams(
            "student-123",
            "assignment-456",
            "learningObj-789",
            new Date(),
            Buffer.from("submission contents"),
            StatusType.NOT_ACCEPTED
        );

        const createdSubmission = new Submission(
            "student-123",
            "assignment-456",
            "learningObj-789",
            inputParams.time,
            inputParams.contents,
            inputParams.status,
            "submission-999"
        );

        mockSubmissionRepository.create.mockResolvedValue("submission-999");

        const result = await createSubmission.execute(inputParams);

        expect(result).toEqual({ id: "submission-999" });
        expect(mockSubmissionRepository.create).toHaveBeenCalledWith(expect.any(Submission));
    });

    test('Should throw a DatabaseError if creation fails', async () => {
        const inputParams = new CreateSubmissionParams(
            "student-123",
            "assignment-456",
            "learningObj-789",
            new Date(),
            Buffer.from("submission contents"),
            StatusType.NOT_ACCEPTED
        );

        mockSubmissionRepository.create.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createSubmission.execute(inputParams)).rejects.toThrow(DatabaseError);
        expect(mockSubmissionRepository.create).toHaveBeenCalledWith(expect.any(Submission));
    });
});
