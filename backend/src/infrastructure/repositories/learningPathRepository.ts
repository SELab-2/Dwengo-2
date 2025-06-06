import { LearningPath } from "../../core/entities/learningPath";
import { ILearningPathRepository } from "../../core/repositories/learningPathRepositoryInterface";
import { DatasourceLearningPath } from "../dwengo_backend/data/data_sources/http/datasourceLearningPath";

export class LearningPathRepository implements ILearningPathRepository {
    private datasource: DatasourceLearningPath = new DatasourceLearningPath();

    public getLanguages(hruid: string): Promise<string[]> {
        return this.datasource.getLanguages(hruid);
    }
    public getLearningPath(hruid: string, includeNodes: boolean, language?: string): Promise<LearningPath> {
        return this.datasource.getLearningPath(hruid, includeNodes, language);
    }
    public getLearningPaths(params: string, includeNodes: boolean): Promise<LearningPath[]> {
        return this.datasource.getLearningPaths(params, includeNodes);
    }
}
