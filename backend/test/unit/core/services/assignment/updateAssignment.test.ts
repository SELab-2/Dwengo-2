import { Assignment } from "../../../../../src/core/entities/assignment";
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

        const mockUpdatedAssignment = new Assignment("1", "1", startDate, deadline, "Name", updatedExtraInstructions, "1");
        const mockNormalAssignment = new Assignment("1", "1", startDate, deadline, "Name", "Original Instructions", "1");

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
