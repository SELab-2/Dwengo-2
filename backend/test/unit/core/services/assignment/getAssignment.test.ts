import { ErrorCode } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { AssignmentTypeORM as Assignment } from "../../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { ClassTypeORM as Class } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { IAssignmentRepository } from "../../../../../src/core/repositories/assignmentRepositoryInterface";
import { GetAssignment, GetAssignmentInput } from "../../../../../src/core/services/assignment/getAssignment";

describe("getAssignment Service", () => {
    let getAssignmentService: GetAssignment;
    let getAssignmentParams: GetAssignmentInput;
    let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;
    let date: Date;

    beforeEach(() => {
        mockAssignmentRepository = {
            getById: jest.fn(), // Mock DB function
        } as unknown as jest.Mocked<IAssignmentRepository>;

        getAssignmentService = new GetAssignment(mockAssignmentRepository);

        getAssignmentParams = {
            id: "1",
        };

        date = new Date();
    });

    test("Should return assignment if found", async () => {
        const assignment = new Assignment();
        assignment.class = new Class()    
        assignment.class.id = "1";
        assignment.learningPathId = "1";
        assignment.start = date;
        assignment.deadline = date;
        assignment.name = "name";
        assignment.extraInstructions = "extra_instructions";
        assignment.id = "1";

        mockAssignmentRepository.getById.mockResolvedValue(assignment);
        const result = await getAssignmentService.execute(getAssignmentParams);

        expect(result).toEqual({
            id: "1",
            classId: "1",
            start: date,
            deadline: date,
            name: "name",
            extraInstructions: "extra_instructions",
            learningPathId: "1",
        });
        expect(mockAssignmentRepository.getById).toHaveBeenCalledWith("1");
    });

    test("Should throw error", async () => {
        mockAssignmentRepository.getById.mockRejectedValue(new EntityNotFoundError("Assignment not found"));

        await expect(getAssignmentService.execute(getAssignmentParams)).rejects.toMatchObject({
            code: ErrorCode.NOT_FOUND,
        });
        expect(mockAssignmentRepository.getById).toHaveBeenCalledWith("1");
    });
});
