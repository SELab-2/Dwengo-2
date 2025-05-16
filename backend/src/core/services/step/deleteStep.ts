import { z } from "zod";
import { StepBaseService } from "./stepBaseService";
import { deleteStepSchema } from "../../../application/schemas/stepSchemas";
import { tryRepoEntityOperation } from "../../helpers";

export type DeleteStepInput = z.infer<typeof deleteStepSchema>;

export class DeleteStep extends StepBaseService<DeleteStepInput> {
    /**
     * Executes the step deletion process.
     * @param input - The input data for deleting a step, validated by deleteStepSchema.
     * @returns An empty object.
     * @throws {ApiError} If the step with the given id is not found.
     */
    async execute(input: DeleteStepInput): Promise<object> {
        await tryRepoEntityOperation(this.stepRepository.delete(input.id), "Step", input.id, true);
        return {};
    }
}
