import { DeleteAssignment } from "../../../../src/core/services/assignment";
import { IAssignmentRepository } from "../../../../src/core/repositories/assignmentRepositoryInterface";
import { EntityNotFoundError } from "../../../../src/config/error";

const mockAssignmentRepository: jest.Mocked<IAssignmentRepository> = {
    delete: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IAssignmentRepository>;

describe("DeleteAssignment service", () => {
    let deleteAssignment: DeleteAssignment;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteAssignment = new DeleteAssignment(mockAssignmentRepository);
    });

    test("Should call deleteAssignmentById with the correct ID", async () => {
        const id = "Assignment-123";

        await deleteAssignment.execute({ id });

        expect(mockAssignmentRepository.delete).toHaveBeenCalledWith(id);
        expect(mockAssignmentRepository.delete).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const id = "Assignment-456";

        const result = await deleteAssignment.execute({id});

        expect(result).toEqual({});
    });

    test("Should throw an error if assignment is not present in database", async () => {
        mockAssignmentRepository.delete.mockRejectedValue(new EntityNotFoundError("Assignment not found"));

        await expect(deleteAssignment.execute({id: "Assignment-789"})).rejects.toThrow(EntityNotFoundError);
    });
});
