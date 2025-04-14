import { LearningObject } from "../../core/entities/learningObject";
import { ILearningObjectRepository } from "../../core/repositories/learningObjectRepositoryInterface";
import { DatasourceLearningObject } from "../dwengo_backend/data/data_sources/http/datasourceLearningObject";

export class LearningObjectRepository implements ILearningObjectRepository {
    private datasource: DatasourceLearningObject = new DatasourceLearningObject();

    public async getVersions(hruid: string): Promise<string[]> {
        return this.datasource.getVersions(hruid);
    }

    public async getLanguages(hruid: string): Promise<string[]> {
        return this.datasource.getLanguages(hruid);
    }

    public async getWrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.datasource.getWrappedLearningObject(hruid, language, version);
    }

    public async getRawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject> {
        return this.datasource.getRawLearningObject(hruid, language, version);
    }

    public async getLearningObjects(params: string): Promise<LearningObject[]> {
        return this.datasource.getLearningObjects(params);
    }
}
