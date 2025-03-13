import { Class } from "../../../../src/core/entities/class";
import { UpdateClass, UpdateClassParams } from "../../../../src/core/services/class";

// Mock repository
const mockClassRepository = {
    updateClass: jest.fn()
};

describe("UpdateClass Service", () => {
    let updateClassService: UpdateClass;

    beforeEach(() => {
        updateClassService = new UpdateClass(mockClassRepository as any);
    });

    it("should update a class and return the updated object", async () => {
        const classId = "1234";
        const updatedName = "Updated Class Name";
        const updatedDescription = "Updated Description";

        const mockUpdatedClass = new Class(updatedName, updatedDescription, "Target Audience", classId);
        mockClassRepository.updateClass.mockResolvedValue(mockUpdatedClass);
        mockUpdatedClass.toObject = jest.fn(() => ({
            id: classId,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        }));

        const params = new UpdateClassParams(classId, updatedName, updatedDescription);
        const result = await updateClassService.execute(params);

        expect(mockClassRepository.updateClass).toHaveBeenCalledWith(classId, {
            name: updatedName,
            description: updatedDescription
        });
        expect(result).toEqual({
            id: classId,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        });
    });

    it("should update only the targetAudience if only that is provided", async () => {
        const classId = "5678";
        const updatedTargetAudience = "Advanced Students";

        const mockUpdatedClass = new Class("Original Name", "Original Description", updatedTargetAudience, classId);
        mockClassRepository.updateClass.mockResolvedValue(mockUpdatedClass);
        mockUpdatedClass.toObject = jest.fn(() => ({
            id: classId,
            name: "Original Name",
            description: "Original Description",
            targetAudience: updatedTargetAudience
        }));

        const params = new UpdateClassParams(classId, undefined, undefined, updatedTargetAudience);
        const result = await updateClassService.execute(params);

        expect(mockClassRepository.updateClass).toHaveBeenCalledWith(classId, {
            targetAudience: updatedTargetAudience
        });
        expect(result).toEqual({
            id: classId,
            name: "Original Name",
            description: "Original Description",
            targetAudience: updatedTargetAudience
        });
    });
});