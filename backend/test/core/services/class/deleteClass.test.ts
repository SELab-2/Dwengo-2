import { DeleteClass } from "../../../../src/core/services/class/deleteClass";
import { IClassRepository } from "../../../../src/core/repositories/classRepositoryInterface";

const mockClassRepository: jest.Mocked<IClassRepository> = {
    deleteClassById: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IClassRepository>;

describe("DeleteClass Use Case", () => {
    let deleteClass: DeleteClass;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteClass = new DeleteClass(mockClassRepository);
    });

    test("Should call deleteClassById with the correct ID", async () => {
        const id = "class-123";

        await deleteClass.execute({ id });

        expect(mockClassRepository.deleteClassById).toHaveBeenCalledWith(id);
        expect(mockClassRepository.deleteClassById).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const id = "class-456";
        const result = await deleteClass.execute({id});

        expect(result).toEqual({});
    });

    test("Should throw an error if repository throws", async () => {
        mockClassRepository.deleteClassById.mockRejectedValue(new Error("Database error"));

        await expect(deleteClass.execute({id: "class-789"})).rejects.toThrow("Database error");
    });
});
