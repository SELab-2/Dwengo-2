import { ApiError } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { DeleteStep, DeleteStepInput } from "../../../../../src/core/services/step/deleteStep";

// Mock repository
const mockStepRepository = {
    delete: jest.fn(),
};

describe("DeleteStep", () => {
    let deleteStep: DeleteStep;
    let input: DeleteStepInput;

    beforeEach(() => {
        deleteStep = new DeleteStep(mockStepRepository as any);
        jest.clearAllMocks();
        input = {
            id: "step-123",
        };
    });

    test("Should delete a step successfully", async () => {
        mockStepRepository.delete.mockResolvedValue(undefined);

        const result = await deleteStep.execute(input);

        expect(result).toEqual({});
        expect(mockStepRepository.delete).toHaveBeenCalledWith("step-123");
    });

    test("Should throw an ApiError if deletion fails", async () => {
        mockStepRepository.delete.mockRejectedValue(new EntityNotFoundError("Entity not found"));

        await expect(deleteStep.execute(input)).rejects.toEqual({
            code: "NOT_FOUND",
            message: `Step with ID ${input.id} not found`,
        } as ApiError);
        expect(mockStepRepository.delete).toHaveBeenCalledWith("step-123");
    });
});
