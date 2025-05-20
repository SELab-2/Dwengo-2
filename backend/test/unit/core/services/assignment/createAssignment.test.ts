import { DatabaseError } from "../../../../../src/config/error";
import { Assignment } from "../../../../../src/core/entities/assignment";
import { CreateAssignment, CreateAssignmentInput } from "../../../../../src/core/services/assignment";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

// Mock repository
const mockAssignmentRepository = {
    create: jest.fn(),
};
const mockUserRepository = {
    getById: jest.fn(),
}

describe("CreateAssignment", () => {
    let create: CreateAssignment;
    let startDate: Date;
    let deadline: Date;
    let inputAssignmentParams: CreateAssignmentInput;
    let inputAssignment: Assignment;
    let createdAssignment: Assignment;

    beforeEach(() => {
        create = new CreateAssignment(mockAssignmentRepository as any, mockUserRepository as any);
        jest.clearAllMocks();
        startDate = new Date();
        deadline = new Date();
        // Reset mocks voor elke test
        inputAssignmentParams = {
            classId: "1",
            learningPathId: "1",
            startDate,
            deadline,
            name: "Name",
            extraInstructions: "Extra Instructions",
        };
        inputAssignment = new Assignment("1", "1", startDate, deadline, "Name", "Extra Instructions");
        createdAssignment = new Assignment("1", "1", startDate, deadline, "Name", "Extra Instructions", "1");
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should create a Assignment and return its ID", async () => {
        mockAssignmentRepository.create.mockResolvedValue(createdAssignment);

        const result = await create.execute("", inputAssignmentParams);

        expect(result).toEqual({ id: "1" });
        expect(mockAssignmentRepository.create).toHaveBeenCalledWith(inputAssignment);
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockAssignmentRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(create.execute("", inputAssignmentParams)).rejects.toThrow(DatabaseError);
        expect(mockAssignmentRepository.create).toHaveBeenCalledWith(inputAssignment);
    });
});
