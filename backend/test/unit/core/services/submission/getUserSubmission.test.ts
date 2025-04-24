import { ErrorCode } from "../../../../../src/application/types";
import { Submission } from "../../../../../src/core/entities/submission";
import { GetUserSubmissions } from "../../../../../src/core/services/submission";


const mockSubmissionRepo = {
  getByStudentId: jest.fn(),
  getAllForStudentInAssignment: jest.fn(),
  getAllForStudentInAssignmentStep: jest.fn(),
};

function createService() {
  const service = new GetUserSubmissions(mockSubmissionRepo as any);
  // @ts-ignore: force assignment
  service.submissionRepository = mockSubmissionRepo;
  return service;
}

describe('GetUserSubmissions', () => {
  const dummySubmission = { id: 'sub1' } as Submission;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all submissions for a user', async () => {
    mockSubmissionRepo.getByStudentId.mockResolvedValue([dummySubmission]);

    const service = createService();
    const result = await service.execute({ idParent: 'user123' });

    expect(result).toEqual({ submisisons: ['sub1'] });
    expect(mockSubmissionRepo.getByStudentId).toHaveBeenCalledWith('user123');
  });

  it('should get submissions for a user in an assignment', async () => {
    mockSubmissionRepo.getAllForStudentInAssignment.mockResolvedValue([dummySubmission]);

    const service = createService();
    const result = await service.execute({
      idParent: 'user123',
      assignmentId: 'assign456',
    });

    expect(result).toEqual({ submisisons: ['sub1'] });
    expect(mockSubmissionRepo.getAllForStudentInAssignment).toHaveBeenCalledWith('user123', 'assign456');
  });

  it('should get submissions for a user in an assignment and step', async () => {
    mockSubmissionRepo.getAllForStudentInAssignmentStep.mockResolvedValue([dummySubmission]);

    const service = createService();
    const result = await service.execute({
      idParent: 'user123',
      assignmentId: 'assign456',
      learningObjectId: 'step789',
    });

    expect(result).toEqual({ submisisons: ['sub1'] });
    expect(mockSubmissionRepo.getAllForStudentInAssignmentStep).toHaveBeenCalledWith('user123', 'assign456', 'step789');
  });

  it('should throw if learningObjectId is provided without assignmentId', async () => {
    const service = createService();

    await expect(service.execute({
      idParent: 'user123',
      learningObjectId: 'step789',
    })).rejects.toMatchObject({
      code: ErrorCode.BAD_REQUEST,
      message: "Can only request submissions for a user inside of an assignment.",
    });
  });
});
