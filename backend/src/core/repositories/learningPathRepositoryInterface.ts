import { LearningPath } from "../entities/learningPath";

/**
 * A class to define the interface for a LearningPathRepository
 */
export abstract class ILearningPathRepository {
    /**
     * Gets all the available languages of a learningPath given it's hruid.
     * @param hruid of the learningPath.
     * @returns a promise that resolves to an array of strings containing the available languages.
     */
    public abstract getLanguages(hruid: string): Promise<string[]>;

    /**
     * Function to get a learningPath given the hruid and language.
     *
     * @param hruid of the learningPath.
     * @param language of the learningPath.
     *
     * @returns a promise that resolves to a learningPath.
     */
    public abstract getLearningPath(hruid: string, language: string): Promise<LearningPath>;

    /**
     * Function to get all available learningPath metadata
     *
     * @returns a promise that resolves to a list of all LearningPaths
     */
    public abstract getLearningPaths(): Promise<LearningPath[]>;
}
