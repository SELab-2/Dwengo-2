import { ApiError } from "../../../../../src/application/types";
import { EntityNotFoundError } from "../../../../../src/config/error";
import { Step, StepType } from "../../../../../src/core/entities/step";
import {
    GetAssignmentSteps,
    GetAssignmentStepsInput,
    GetStep,
    GetStepInput,
} from "../../../../../src/core/services/step/getStep";

// Mock repository
const mockStepRepository = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    getByAssignmentId: jest.fn(),
    getByAssignmentObjectId: jest.fn(),
};

describe("GetStep", () => {
    let getStep: GetStep;
    let input: GetStepInput;

    beforeEach(() => {
        getStep = new GetStep(mockStepRepository as any);
        jest.clearAllMocks();
        input = {
            id: "step-123",
        };
    });

    test("Should retrieve a step by ID and return it as an object", async () => {
        const step = new Step(
            "assignment-456",
            "obj-789",
            StepType.MULTIPLE_CHOICE,
            '{"question": "What?"}',
            "step-123",
        );
        mockStepRepository.getById.mockResolvedValue(step);

        const result = await getStep.execute(input);

        expect(result).toEqual(step.toObject());
        expect(mockStepRepository.getById).toHaveBeenCalledWith("step-123");
    });

    test("Should throw an ApiError if retrieval fails", async () => {
        mockStepRepository.getById.mockRejectedValue(new EntityNotFoundError("Entity not found"));

        await expect(getStep.execute(input)).rejects.toEqual({
            code: "NOT_FOUND",
            message: `Step with ID ${input.id} not found`,
        } as ApiError);
        expect(mockStepRepository.getById).toHaveBeenCalledWith("step-123");
    });
});

describe("GetAssignmentSteps", () => {
    let getAssignmentSteps: GetAssignmentSteps;
    let input: GetAssignmentStepsInput;

    beforeEach(() => {
        getAssignmentSteps = new GetAssignmentSteps(mockStepRepository as any);
        jest.clearAllMocks();
        input = {
            idParent: "assignment-456",
        };
    });

    test("Should retrieve all steps for an assignment and return their IDs", async () => {
        const step1 = new Step(
            "assignment-456",
            "obj-789",
            StepType.MULTIPLE_CHOICE,
            '{"question": "What?"}',
            "step-123",
        );
        const step2 = new Step("assignment-456", "obj-790", StepType.OPEN_QUESTION, '{"question": "Why?"}', "step-124");
        mockStepRepository.getByAssignmentId.mockResolvedValue([step1, step2]);

        const result = await getAssignmentSteps.execute(input);

        expect(result).toEqual({ steps: ["step-123", "step-124"] });
        expect(mockStepRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-456");
    });

    test("Should retrieve steps for an assignment and learning object and return their IDs", async () => {
        const inputWithObject = { ...input, learningObjectId: "obj-789" };
        const step = new Step(
            "assignment-456",
            "obj-789",
            StepType.MULTIPLE_CHOICE,
            '{"question": "What?"}',
            "step-123",
        );
        mockStepRepository.getByAssignmentObjectId.mockResolvedValue([step]);

        const result = await getAssignmentSteps.execute(inputWithObject);

        expect(result).toEqual({ steps: ["step-123"] });
        expect(mockStepRepository.getByAssignmentObjectId).toHaveBeenCalledWith("assignment-456", "obj-789");
    });

    test("Should return an empty steps array if no steps are found", async () => {
        mockStepRepository.getByAssignmentId.mockResolvedValue([]);

        const result = await getAssignmentSteps.execute(input);

        expect(result).toEqual({ steps: [] });
        expect(mockStepRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-456");
    });

    test("Should throw an ApiError if retrieval fails", async () => {
        mockStepRepository.getByAssignmentId.mockRejectedValue(new EntityNotFoundError("Entity not found"));

        await expect(getAssignmentSteps.execute(input)).rejects.toEqual({
            code: "NOT_FOUND",
            message: `Assignment with ID ${input.idParent} not found`,
        } as ApiError);
        expect(mockStepRepository.getByAssignmentId).toHaveBeenCalledWith("assignment-456");
    });

    test("Should throw an ApiError if retrieval with learning object fails", async () => {
        const inputWithObject = { ...input, learningObjectId: "obj-789" };
        mockStepRepository.getByAssignmentObjectId.mockRejectedValue(new EntityNotFoundError("Entity not found"));

        await expect(getAssignmentSteps.execute(inputWithObject)).rejects.toEqual({
            code: "NOT_FOUND",
            message: `Assignment | Object with ID ${input.idParent} | ${inputWithObject.learningObjectId} not found`,
        } as ApiError);
        expect(mockStepRepository.getByAssignmentObjectId).toHaveBeenCalledWith("assignment-456", "obj-789");
    });
});
