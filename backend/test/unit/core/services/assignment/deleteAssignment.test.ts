import { DeleteAssignment } from "../../../../../src/core/services/assignment";
import { IAssignmentRepository } from "../../../../../src/core/repositories/assignmentRepositoryInterface";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { ErrorCode } from "../../../../../src/application/types";
import * as RightsValidator from "../../../../../src/core/helpers";
import { IUserRepository } from "../../../../../src/core/repositories/userRepositoryInterface";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

const mockAssignmentRepository: jest.Mocked<IAssignmentRepository> = {
    delete: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IAssignmentRepository>;

const mockUserRepository = {
    getById: jest.fn(),
} as unknown as jest.Mocked<IUserRepository>;

describe("DeleteAssignment service", () => {
    let deleteAssignment: DeleteAssignment;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteAssignment = new DeleteAssignment(mockAssignmentRepository, mockUserRepository);
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should call deleteAssignmentById with the correct ID", async () => {
        const id = "Assignment-123";

        await deleteAssignment.execute("", { id });

        expect(mockAssignmentRepository.delete).toHaveBeenCalledWith(id);
        expect(mockAssignmentRepository.delete).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const id = "Assignment-456";

        const result = await deleteAssignment.execute("", { id });

        expect(result).toEqual({});
    });

    test("Should throw an error if assignment is not present in database", async () => {
        mockAssignmentRepository.delete.mockRejectedValue(new EntityNotFoundError("Assignment not found"));

        await expect(deleteAssignment.execute("", { id: "Assignment-789" })).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
    });
});
