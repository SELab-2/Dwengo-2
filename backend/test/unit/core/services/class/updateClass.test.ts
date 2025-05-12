import { ClassTypeORM as Class } from "../../../../../src/infrastructure/database/data/data_models/classTypeorm";
import { UpdateClass } from "../../../../../src/core/services/class";

// Mock repository
const mockClassRepository = {
    update: jest.fn(),
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

        const mockUpdatedClass = new Class();
        mockUpdatedClass.name = updatedName;
        mockUpdatedClass.description = updatedDescription;
        mockUpdatedClass.targetAudience = "Target Audience";
        mockUpdatedClass.id = id;

        mockClassRepository.update.mockResolvedValue(mockUpdatedClass);

        const params = {
            id: id,
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience",
        };

        const result = await updateClassService.execute(params);

        expect(mockClassRepository.update).toHaveBeenCalledWith(id, {
            name: updatedName,
            description: updatedDescription,
            targetAudience: "Target Audience",
        });

        expect(result).toEqual({});
    });

    it("should update only the targetAudience if only that is provided", async () => {
        const id = "5678";
        const updatedTargetAudience = "Advanced Students";

        const mockUpdatedClass = new Class();
        mockUpdatedClass.name = "Original Name";
        mockUpdatedClass.description = "Original Description";
        mockUpdatedClass.targetAudience = updatedTargetAudience;
        mockUpdatedClass.id = id;

        mockClassRepository.update.mockResolvedValue(mockUpdatedClass);

        const params = {
            id: id,
            targetAudience: updatedTargetAudience,
        };

        const result = await updateClassService.execute(params);

        expect(mockClassRepository.update).toHaveBeenCalledWith(id, {
            targetAudience: updatedTargetAudience,
        });
        expect(result).toEqual({});
    });
});
