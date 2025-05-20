import { IClassRepository } from "../../../../../src/core/repositories/classRepositoryInterface";
import { DeleteClass } from "../../../../../src/core/services/class/deleteClass";
import * as RightsValidator from "../../../../../src/core/helpers";

const mockValidateUserRights = jest.spyOn(RightsValidator, "validateUserRights");

const mockClassRepository: jest.Mocked<IClassRepository> = {
    delete: jest.fn().mockResolvedValue(undefined), // Simuleert een succesvolle verwijdering
} as unknown as jest.Mocked<IClassRepository>;

describe("DeleteClass Use Case", () => {
    let deleteClass: DeleteClass;

    beforeEach(() => {
        jest.clearAllMocks(); // Zorgt ervoor dat mocks schoon zijn voor elke test
        deleteClass = new DeleteClass(mockClassRepository);
        mockValidateUserRights.mockResolvedValue();
    });

    test("Should call deleteClassById with the correct ID", async () => {
        const id = "class-123";

        await deleteClass.execute("", { id });

        expect(mockClassRepository.delete).toHaveBeenCalledWith(id);
        expect(mockClassRepository.delete).toHaveBeenCalledTimes(1);
    });

    test("Should return an empty object after successful deletion", async () => {
        const id = "class-456";
        const result = await deleteClass.execute("", { id });

        expect(result).toEqual({});
    });

    test("Should throw an error if repository throws", async () => {
        mockClassRepository.delete.mockRejectedValue(new Error("Database error"));

        await expect(deleteClass.execute("", { id: "class-789" })).rejects.toThrow("Database error");
    });
});
