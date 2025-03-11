import { UpdateClass, UpdateClassParams } from "../../../../src/core/services/class/updateClass";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";
import { Class } from "../../../../src/core/entities/class";

const mockClassRepository: jest.Mocked<IClassRepository> = {
    updateClass: jest.fn(),
} as unknown as jest.Mocked<IClassRepository>;

describe("UpdateClass Use Case", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("UpdateClass should call repository with correct parameters", async () => {
        const classId = "class-123";
        const updatedFields = { name: "Updated Class Name" };
        const updatedClass = new Class("Updated Class Name", "Old Desc", "Old Audience", classId);

        mockClassRepository.updateClass.mockResolvedValue(updatedClass);

        const updateClassService = new UpdateClass(mockClassRepository);
        const params = new UpdateClassParams(classId, "Updated Class Name");
        const result = await updateClassService.execute(params);

        expect(mockClassRepository.updateClass).toHaveBeenCalledWith(classId, updatedFields);
        expect(mockClassRepository.updateClass).toHaveBeenCalledTimes(1);
        expect(result).toEqual(updatedClass);
    });

    test("UpdateClass should only send provided fields", async () => {
        const classId = "class-456";
        const updatedFields = { description: "New Description" };
        const existingClass = new Class("Math", "Old Desc", "High School", classId);
        const updatedClass = new Class("Math", "New Description", "High School", classId);

        mockClassRepository.updateClass.mockResolvedValue(updatedClass);

        const updateClassService = new UpdateClass(mockClassRepository);
        const params = new UpdateClassParams(classId, undefined, "New Description");
        const result = await updateClassService.execute(params);

        expect(mockClassRepository.updateClass).toHaveBeenCalledWith(classId, updatedFields);
        expect(mockClassRepository.updateClass).toHaveBeenCalledTimes(1);
        expect(result).toEqual(updatedClass);
    });

    test("UpdateClass should throw an error if the class is not found", async () => {
        mockClassRepository.updateClass.mockRejectedValue(new Error("Class not found"));

        const updateClassService = new UpdateClass(mockClassRepository);
        const params = new UpdateClassParams("invalid-id", "New Name");

        await expect(updateClassService.execute(params)).rejects.toThrow("Class not found");
    });
});
