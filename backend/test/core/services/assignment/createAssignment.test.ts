import { DatabaseError } from '../../../../src/config/error';
import { Assignment} from '../../../../src/core/entities/assignment';
import { CreateAssignment, CreateAssignmentParams } from '../../../../src/core/services/assignment';

// Mock repository
const mockAssignmentRepository = {
    createAssignment: jest.fn(),
};

describe('CreateAssignment', () => {
    let createAssignment: CreateAssignment;
    let startDate: Date;
    let deadline: Date;
    let inputAssignmentParams: CreateAssignmentParams;
    let inputAssignment: Assignment;
    let createdAssignment: Assignment;

    beforeEach(() => {
        createAssignment = new CreateAssignment(mockAssignmentRepository as any);
        jest.clearAllMocks();
        startDate = new Date();
        deadline = new Date();
        // Reset mocks voor elke test
        inputAssignmentParams = new CreateAssignmentParams("1", "1", startDate, deadline, "Extra Instructions", "1");
        inputAssignment = new Assignment("1", "1", startDate, deadline, "Extra Instructions");
        createdAssignment = new Assignment("1", "1", startDate, deadline, "Extra Instructions", "1");
    });

    test('Should create a Assignment and return its ID', async () => {
        mockAssignmentRepository.createAssignment.mockResolvedValue(createdAssignment);

        const result = await createAssignment.execute(inputAssignmentParams);

        expect(result).toEqual({ id: "1" });
        expect(mockAssignmentRepository.createAssignment).toHaveBeenCalledWith(inputAssignment, "1");
    });

    test('Should throw a DatabaseError if creation fails', async () => {
        mockAssignmentRepository.createAssignment.mockRejectedValue(new DatabaseError('Creation failed'));

        await expect(createAssignment.execute(inputAssignmentParams)).rejects.toThrow(DatabaseError);
        expect(mockAssignmentRepository.createAssignment).toHaveBeenCalledWith(inputAssignment, "1");
    });
});
