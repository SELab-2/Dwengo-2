import { LearningObject } from "../../core/entities/LearningObject";
import { LearningObjectRepositoryInterface } from "../../core/repositories/LearningObjectRepositoryInterface";
import { DatasourceLearningObject } from "../dwengo_backend/data/data_sources/http/datasourceLearningObject";
import { IDatasourceLearningObject } from "../dwengo_backend/data/data_sources/IDatasourceLearningObject";

export class LearningObjectRepository implements LearningObjectRepositoryInterface {
    private datasource: IDatasourceLearningObject = new DatasourceLearningObject();

    public async getLearningObjects(): Promise<LearningObject[]> {
        return this.datasource.getLearningObjects();
    }
}
