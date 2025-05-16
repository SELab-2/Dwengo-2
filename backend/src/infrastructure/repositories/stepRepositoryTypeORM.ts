import { Step } from "../../core/entities/step";
import { IStepRepository } from "../../core/repositories/stepRepositoryInterface";
import { DatasourceStepTypeORM } from "../database/data/data_sources/typeorm/datasourceStepTypeORM";

export class StepRepositoryTypeORM extends IStepRepository {
    private datasourceStep: DatasourceStepTypeORM;

    public constructor() {
        super();
        this.datasourceStep = new DatasourceStepTypeORM();
    }

    public async create(step: Step): Promise<Step> {
        return await this.datasourceStep.create(step);
    }

    public async getById(code: string): Promise<Step> {
        return await this.datasourceStep.getById(code);
    }

    public async getByAssignmentId(assignmentId: string): Promise<Step[]> {
        return await this.datasourceStep.getByAssignmentId(assignmentId);
    }

    public async getByAssignmentObjectId(assignmentId: string, learningObjectId: string): Promise<Step[]> {
        return await this.datasourceStep.getByAssignmentObjectId(assignmentId, learningObjectId);
    }

    public async update(step: Step): Promise<Step> {
        return await this.datasourceStep.update(step);
    }

    public async delete(code: string): Promise<void> {
        await this.datasourceStep.delete(code);
    }
}
