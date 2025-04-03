import { LearningPath } from "../../core/entities/learningPath";
import { ILearningPathRepository } from "../../core/repositories/learningPathRepositoryInterface";
import { DatasourceLearningPath } from "../dwengo_backend/data/data_sources/http/datasourceLearningPath";

export class LearningPathRepository implements ILearningPathRepository {
    private datasource: DatasourceLearningPath = new DatasourceLearningPath();

    public getLanguages(hruid: string): Promise<string[]> {
        return this.datasource.getLanguages(hruid);
    }
    public getLearningPath(hruid: string, language: string): Promise<LearningPath> {
        return this.datasource.getLearningPath(hruid, language);
    }
    public getLearningPaths(): Promise<LearningPath[]> {
        return this.datasource.getLearningPaths();
    }
    
}
