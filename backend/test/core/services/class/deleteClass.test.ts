import { DeleteClass, DeleteClassParams } from "../../../../src/core/services/class/deleteClass";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";

const mockClassRepository: jest.Mocked<IClassRepository> = {
    deleteById: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IClassRepository>;

describe("DeleteClass Use Case", () => {
    let deleteClass: DeleteClass;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteClass = new DeleteClass(mockClassRepository);
    });

    test("Should call deleteClassById with the correct ID", async () => {
        const classId = "class-123";
        const params = new DeleteClassParams(classId);

        await deleteClass.execute(params);

        expect(mockClassRepository.deleteById).toHaveBeenCalledWith(classId);
        expect(mockClassRepository.deleteById).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const classId = "class-456";
        const params = new DeleteClassParams(classId);

        const result = await deleteClass.execute(params);

        expect(result).toEqual({});
    });

    test("Should throw an error if repository throws", async () => {
        mockClassRepository.deleteById.mockRejectedValue(new Error("Database error"));

        const params = new DeleteClassParams("class-789");

        await expect(deleteClass.execute(params)).rejects.toThrow("Database error");
    });
});
