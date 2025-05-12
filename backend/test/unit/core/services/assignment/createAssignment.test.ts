import { DatabaseError } from "../../../../../src/config/error";
import { AssignmentTypeORM as Assignment } from "../../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { CreateAssignment, CreateAssignmentInput } from "../../../../../src/core/services/assignment";
import { ClassTypeORM as Class } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";

// Mock repository
const mockAssignmentRepository = {
    create: jest.fn(),
};

describe("CreateAssignment", () => {
    let create: CreateAssignment;
    let startDate: Date;
    let deadline: Date;
    let inputAssignmentParams: CreateAssignmentInput;
    let inputAssignment: Assignment;
    let createdAssignment: Assignment;

    beforeEach(() => {
        create = new CreateAssignment(mockAssignmentRepository as any);
        jest.clearAllMocks();
        startDate = new Date();
        deadline = new Date();
        // Reset mocks voor elke test
        inputAssignmentParams = {
            classId: "1",
            learningPathId: "1",
            start: startDate,
            deadline,
            name: "Name",
            extraInstructions: "Extra Instructions",
        };
        inputAssignment = new Assignment();
        inputAssignment.class = new Class()
        inputAssignment.class.id = "1";
        inputAssignment.learningPathId = "1";
        inputAssignment.start = startDate;
        inputAssignment.deadline = deadline;
        inputAssignment.name = "Name";
        inputAssignment.extraInstructions = "Extra Instructions";

        createdAssignment = new Assignment();
        createdAssignment.class = new Class()
        createdAssignment.class.id = "1";
        createdAssignment.learningPathId = "1";
        createdAssignment.start = startDate;
        createdAssignment.deadline = deadline;
        createdAssignment.name = "Name";
        createdAssignment.extraInstructions = "Extra Instructions";
        createdAssignment.id = "1";
    });

    test("Should create a Assignment and return its ID", async () => {
        mockAssignmentRepository.create.mockResolvedValue(createdAssignment);

        const result = await create.execute(inputAssignmentParams);

        expect(result).toEqual({ id: "1" });
        expect(mockAssignmentRepository.create).toHaveBeenCalledWith(inputAssignment);
    });

    test("Should throw a DatabaseError if creation fails", async () => {
        mockAssignmentRepository.create.mockRejectedValue(new DatabaseError("Creation failed"));

        await expect(create.execute(inputAssignmentParams)).rejects.toThrow(DatabaseError);
        expect(mockAssignmentRepository.create).toHaveBeenCalledWith(inputAssignment);
    });
});
