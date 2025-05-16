import { DatasourceTypeORM } from "./datasourceTypeORM";
import { EntityNotFoundError } from "../../../../../config/error";
import { Step } from "../../../../../core/entities/step";
import { AssignmentTypeORM } from "../../data_models/assignmentTypeorm";
import { StepTypeORM } from "../../data_models/stepTypeorm";

export class DatasourceStepTypeORM extends DatasourceTypeORM {
    public async create(step: Step): Promise<Step> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const stepRepository = datasource.getRepository(StepTypeORM);

        // Find the relevant assignment
        const assignmentModel = await assignmentRepository.findOne({ where: { id: step.assignmentId } });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${step.assignmentId} not found`);
        }

        // Create a new step
        const stepModel = StepTypeORM.createTypeORM(step, assignmentModel);

        const savedStepModel = await stepRepository.save(stepModel);

        return savedStepModel.toEntity();
    }

    public async getById(id: string): Promise<Step> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const stepRepository = datasource.getRepository(StepTypeORM);
        const stepModel: StepTypeORM | null = await stepRepository.findOne({
            where: { id: id },
            relations: ["assignment"],
        });

        if (!stepModel) {
            throw new EntityNotFoundError(`Step with id ${id} not found`);
        }

        const step: Step = stepModel.toEntity();
        return step;
    }

    public async update(step: Step): Promise<Step> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const stepRepository = datasource.getRepository(StepTypeORM);
        const stepModel: StepTypeORM | null = await stepRepository.findOne({
            where: { id: step.id },
            relations: ["assignment"],
        });

        if (!stepModel) {
            throw new EntityNotFoundError(`Step with id ${step.id} not found`);
        }

        const updatedStep = StepTypeORM.createTypeORM(step, stepModel.assignment);
        await stepRepository.delete(stepModel.id);
        const savedStepModel = await stepRepository.save(updatedStep);

        return savedStepModel.toEntity();
    }

    public async delete(id: string): Promise<void> {
        const datasource = await DatasourceTypeORM.datasourcePromise;
        const stepRepository = datasource.getRepository(StepTypeORM);
        const stepModel: StepTypeORM | null = await stepRepository.findOne({ where: { id: id } });

        if (!stepModel) {
            throw new EntityNotFoundError(`Step with id ${id} not found`);
        }

        await stepRepository.delete(id);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Step[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const stepRepository = datasource.getRepository(StepTypeORM);

        const assignmentModel = await assignmentRepository.findOne({ where: { id: assignmentId } });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${assignmentId} not found`);
        }

        const steps = await stepRepository.find({
            where: { assignment: assignmentModel },
            relations: ["assignment"],
        });

        return steps.map(model => model.toEntity());
    }

    public async getByAssignmentObjectId(assignmentId: string, learningObjectId: string): Promise<Step[]> {
        const datasource = await DatasourceTypeORM.datasourcePromise;

        const assignmentRepository = datasource.getRepository(AssignmentTypeORM);
        const stepRepository = datasource.getRepository(StepTypeORM);

        const assignmentModel = await assignmentRepository.findOne({ where: { id: assignmentId } });

        if (!assignmentModel) {
            throw new EntityNotFoundError(`Assignment with id ${assignmentId} not found`);
        }

        const steps = await stepRepository.find({
            where: { assignment: assignmentModel, learning_object_id: learningObjectId },
            relations: ["assignment"],
        });

        return steps.map(model => model.toEntity());
    }
}
