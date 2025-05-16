import { z } from "zod";
import { StepBaseService } from "./stepBaseService";
import { createStepSchema } from "../../../application/schemas/stepSchemas";
import { Step } from "../../entities/step";
import { tryRepoEntityOperation } from "../../helpers";
import { ILearningObjectRepository } from "../../repositories/learningObjectRepositoryInterface";
import { IStepRepository } from "../../repositories/stepRepositoryInterface";

export type CreateStepInput = z.infer<typeof createStepSchema>;

export class CreateStep extends StepBaseService<CreateStepInput> {
    public constructor(
        protected stepRepository: IStepRepository,
        private learningObjectRepository: ILearningObjectRepository,
    ) {
        super(stepRepository);
    }

    /**
     * Executes the step creation process.
     * @param input - The input data for creating a step, validated by createStepSchema.
     * @returns A promise resolving to an object containing the ID of the created step.
     * @throws {ApiError} If the given assignment, learning-object are not found or if the creation fails.
     */
    async execute(input: CreateStepInput): Promise<object> {
        const step = new Step(input.assignmentId, input.learningObjectId, input.type, input.form);
        await tryRepoEntityOperation(
            this.learningObjectRepository.getVersions(input.learningObjectId),
            "LearningObject",
            `${input.learningObjectId}`,
            true,
        );

        const createdStep = await tryRepoEntityOperation(
            this.stepRepository.create(step),
            " Assignment",
            `${step.assignmentId}`,
            true,
        );

        return { id: createdStep };
    }
}
