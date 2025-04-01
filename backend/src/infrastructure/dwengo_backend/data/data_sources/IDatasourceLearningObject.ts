import { LearningObject } from "../../../../core/entities/LearningObject";

/**
 * Interface for the datasource of the learning object
 */
export abstract class IDatasourceLearningObject {
    /**
     * Return the host of the datasource
     */
    public abstract get host(): string;

    /**
     * Return a wrapped HTML-learningObject
     */
    public abstract getWrappedLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;

    /**
     * Return a raw HTML-learningObject
     */
    public abstract getRawLearningObject(hruid: string, language: string, version: number): Promise<LearningObject>;

    /**
     * Return all learning objects
     */
    public abstract getLearningObjects(): Promise<LearningObject[]>;
}
