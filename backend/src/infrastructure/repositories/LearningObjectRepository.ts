import { LearningObject } from "../../core/entities/LearningObject";
import { ILearningObjectRepository } from "../../core/repositories/LearningObjectRepositoryInterface";
import { DatasourceLearningObject } from "../dwengo_backend/data/data_sources/http/datasourceLearningObject";

export class LearningObjectRepository implements ILearningObjectRepository {
    private datasource: DatasourceLearningObject = new DatasourceLearningObject();

    public async getwrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.datasource.getWrappedLearningObject(hruid, language, version);
    }

    public async getrawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.datasource.getRawLearningObject(hruid, language, version);
    }

    public async getLearningObjects(): Promise<LearningObject[]> {
        return this.datasource.getLearningObjects();
    }
}
