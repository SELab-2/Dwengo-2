import { DeleteAssignment, DeleteAssignmentParams } from "../../../../src/core/services/assignment";
import { IAssignmentRepository } from "../../../../src/core/repositories/assignmentRepositoryInterface";
import { EntityNotFoundError } from "../../../../src/config/error";

const mockAssignmentRepository: jest.Mocked<IAssignmentRepository> = {
    delete: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IAssignmentRepository>;

describe("DeleteAssignment Use Case", () => {
    let deleteAssignment: DeleteAssignment;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteAssignment = new DeleteAssignment(mockAssignmentRepository);
    });

    test("Should call deleteById with the correct ID", async () => {
        const AssignmentId = "Assignment-123";
        const params = new DeleteAssignmentParams(AssignmentId);

        await deleteAssignment.execute(params);

        expect(mockAssignmentRepository.delete).toHaveBeenCalledWith(AssignmentId);
        expect(mockAssignmentRepository.delete).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const AssignmentId = "Assignment-456";
        const params = new DeleteAssignmentParams(AssignmentId);

        const result = await deleteAssignment.execute(params);

        expect(result).toEqual({});
    });

    test("Should throw an error if assignment is not present in database", async () => {
        mockAssignmentRepository.delete.mockRejectedValue(new EntityNotFoundError("Assignment not found"));

        const params = new DeleteAssignmentParams("Assignment-789");

        await expect(deleteAssignment.execute(params)).rejects.toThrow(EntityNotFoundError);
    });
});
