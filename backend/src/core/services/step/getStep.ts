import { z } from "zod";
import { StepBaseService } from "./stepBaseService";
import { getStepSchema, getAssignmentStepsSchema } from "../../../application/schemas/stepSchemas";
import { Step } from "../../entities/step";
import { tryRepoEntityOperation } from "../../helpers";

export type GetStepInput = z.infer<typeof getStepSchema>;

export class GetStep extends StepBaseService<GetStepInput> {
    /**
     * Executes the step get process.
     * @param input - The input data for getting a step, validated by getStepSchema.
     * @returns A promise resolving to a step transformed into an object.
     * @throws {ApiError} If the step with the given id was not found.
     */
    async execute(input: GetStepInput): Promise<object> {
        return (await tryRepoEntityOperation(this.stepRepository.getById(input.id), "Step", input.id, true)).toObject();
    }
}

export type GetAssignmentStepsInput = z.infer<typeof getAssignmentStepsSchema>;

export class GetAssignmentSteps extends StepBaseService<GetAssignmentStepsInput> {
    /**
     * @param input - The input data for getting a step, validated by getAssignmentStepsSchema.
     * @returns A promise resolving to an object containing an array with the IDs of the steps.
     * @throws {ApiError} If the assignmentId is not provided when learningObjectId is provided.
     */
    async execute(input: GetAssignmentStepsInput): Promise<object> {
        const promise = input.learningObjectId
            ? this.stepRepository.getByAssignmentObjectId(input.idParent, input.learningObjectId)
            : this.stepRepository.getByAssignmentId(input.idParent);

        const steps: Step[] = await tryRepoEntityOperation(
            promise,
            input.learningObjectId ? "Assignment | Object" : "Assignment",
            input.learningObjectId ? `${input.idParent} | ${input.learningObjectId}` : `${input.idParent}`,
            true,
        );

        return { steps: steps.map(step => step.id!) };
    }
}
