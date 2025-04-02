import { LearningObject } from "../entities/learningObject";

/**
 * A class to define the interface for a LearningObjectRepository
 */
export abstract class ILearningObjectRepository {
    public abstract getVersions(hruid: string): Promise<string[]>;
    public abstract getLanguages(hruid: string): Promise<string[]>;
    public abstract getrawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;
    public abstract getwrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;
    public abstract getLearningObjects(): Promise<LearningObject[]>;
}
