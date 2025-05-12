import { AssignmentTypeORM as Assignment } from "../../../../../src/infrastructure/database/data/data_models/assignmentTypeorm";
import { ClassTypeORM as Class } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { UpdateAssignment } from "../../../../../src/core/services/assignment";

// Mock repository
const mockAssignmentRepository = {
    getById: jest.fn(),
    update: jest.fn(),
};

describe("UpdateAssignment Service", () => {
    let updateAssignmentService: UpdateAssignment;
    let startDate: Date;
    let deadline: Date;

    beforeEach(() => {
        updateAssignmentService = new UpdateAssignment(mockAssignmentRepository as any);
        startDate = new Date();
        deadline = new Date();
    });

    it("should update an Assignment and return the updated object", async () => {
        const assignmentId = "1";
        const updatedExtraInstructions = "Updated Instructions";

        

        const mockUpdatedAssignment = new Assignment();
        mockUpdatedAssignment.class = new Class()
        mockUpdatedAssignment.class.id = "1";
        mockUpdatedAssignment.learningPathId = "1";
        mockUpdatedAssignment.start = startDate;
        mockUpdatedAssignment.deadline = deadline;
        mockUpdatedAssignment.name = "Name";
        mockUpdatedAssignment.extraInstructions = updatedExtraInstructions;
        mockUpdatedAssignment.id = "1";

        const mockNormalAssignment = new Assignment();
        mockNormalAssignment.class = new Class()
        mockNormalAssignment.class.id = "1";
        mockNormalAssignment.learningPathId = "1";
        mockNormalAssignment.start = startDate;
        mockNormalAssignment.deadline = deadline;
        mockNormalAssignment.name = "Name";
        mockNormalAssignment.extraInstructions = "Original Instructions";
        mockNormalAssignment.id = "1";

        mockAssignmentRepository.getById.mockResolvedValue(mockNormalAssignment);
        mockAssignmentRepository.update.mockResolvedValue(mockUpdatedAssignment);

        const params = {
            id: assignmentId,
            extraInstructions: updatedExtraInstructions,
        };
        const result = await updateAssignmentService.execute(params);

        expect(mockAssignmentRepository.update).toHaveBeenCalledWith(mockUpdatedAssignment);
        expect(result).toEqual({});
    });
});
