import { Assignment } from "../../../../src/core/entities/assignment";
import { UpdateAssignment } from "../../../../src/core/services/assignment";

// Mock repository
const mockAssignmentRepository = {
    updateAssignmentById: jest.fn()
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
        const teacherId = "1";
        const updatedExtraInstructions = "Updated Instructions";

        const mockUpdatedAssignment = new Assignment("1", "1", startDate, deadline, updatedExtraInstructions, "1");
        mockAssignmentRepository.updateAssignmentById.mockResolvedValue(mockUpdatedAssignment);
        mockUpdatedAssignment.toObject = jest.fn(() => ({
            id: teacherId,
            classId: "1",
            learningPathId: "1",
            startDate: startDate,
            deadline: deadline,
            extraInstructions: updatedExtraInstructions
        }));

        const params = {
            id: teacherId,
            extraInstructions: updatedExtraInstructions
        }
        const result = await updateAssignmentService.execute(params);

        expect(mockAssignmentRepository.updateAssignmentById).toHaveBeenCalledWith(teacherId, {
            extraInstructions: updatedExtraInstructions
        });
        expect(result).toEqual({});
    });
});