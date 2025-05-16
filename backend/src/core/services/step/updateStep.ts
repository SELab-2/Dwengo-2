import { z } from "zod";
import { StepBaseService } from "./stepBaseService";
import { updateStepSchema } from "../../../application/schemas/stepSchemas";
import { Step } from "../../entities/step";
import { tryRepoEntityOperation } from "../../helpers";
import { ILearningObjectRepository } from "../../repositories/learningObjectRepositoryInterface";
import { IStepRepository } from "../../repositories/stepRepositoryInterface";

export type UpdateStepInput = z.infer<typeof updateStepSchema>;

export class UpdateStep extends StepBaseService<UpdateStepInput> {
    public constructor(
        protected stepRepository: IStepRepository,
        private learningObjectRepository: ILearningObjectRepository,
    ) {
        super(stepRepository);
    }

    /**
     * Executes the step update process.
     * @param input - The input data for updating a step, validated by updateStepSchema.
     * @returns A promise resolving to an empty object.
     * @throws {ApiError} If the step with the given id is not found.
     */
    async execute(input: UpdateStepInput): Promise<object> {
        if (input.learningObjectId) {
            await tryRepoEntityOperation(
                this.learningObjectRepository.getVersions(input.learningObjectId),
                "LearningObject",
                `${input.learningObjectId}`,
                true,
            );
        }

        const step: Step = await tryRepoEntityOperation(this.stepRepository.getById(input.id), "Step", input.id, true);
        step.assignmentId = input.assignmentId || step.assignmentId;
        step.learningObjectId = input.learningObjectId || step.learningObjectId;
        step.type = input.type || step.type;
        step.form = input.form || step.form;

        await tryRepoEntityOperation(this.stepRepository.update(step), "Step", input.id, true);
        return {};
    }
}
