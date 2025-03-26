import { Class } from "../../../../src/core/entities/class";
import { UpdateClass } from "../../../../src/core/services/class";

// Mock repository
const mockClassRepository = {
    update: jest.fn()
};

describe("UpdateClass Service", () => {
    let updateClassService: UpdateClass;

    beforeEach(() => {
        updateClassService = new UpdateClass(mockClassRepository as any);
    });

    it("should update a class and return the updated object", async () => {
        const id = "1234";
        const updatedName = "Updated Class Name";
        const updatedDescription = "Updated Description";

        const mockUpdatedClass = new Class(updatedName, updatedDescription, "Target Audience", id);
        mockClassRepository.update.mockResolvedValue(mockUpdatedClass);
        mockUpdatedClass.toObject = jest.fn(() => ({
            id: id,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        }));

        const params = {
            id: id,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        };

        const result = await updateClassService.execute(params);

        expect(mockClassRepository.update).toHaveBeenCalledWith(id, {
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        });

        expect(result).toEqual({
            id: id,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience"
        });
    });

    it("should update only the targetAudience if only that is provided", async () => {
        const id = "5678";
        const updatedTargetAudience = "Advanced Students";

        const mockUpdatedClass = new Class("Original Name", "Original Description", updatedTargetAudience, id);
        mockClassRepository.update.mockResolvedValue(mockUpdatedClass);
        mockUpdatedClass.toObject = jest.fn(() => ({
            id: id,
            name: "Original Name",
            description: "Original Description",
            targetAudience: updatedTargetAudience
        }));
        const params = {
            id: id,
            targetAudience: updatedTargetAudience
        };
        
        const result = await updateClassService.execute(params);

        expect(mockClassRepository.update).toHaveBeenCalledWith(id, {
            targetAudience: updatedTargetAudience
        });
        expect(result).toEqual({
            id: id,
            name: "Original Name",
            description: "Original Description",
            targetAudience: updatedTargetAudience
        });
    });
});